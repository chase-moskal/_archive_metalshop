
import * as loading from "../toolbox/loading.js"
import {observable, action, computed} from "mobx"
import {makeTicketbooth} from "../toolbox/ticketbooth.js"
import {GetAuthContext, AuthPayload} from "../interfaces.js"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"
import {ProfileMagistrateTopic, Profile} from "authoritarian/dist/interfaces.js"

export class ProfileModel {
	@observable profileLoad = loading.load<Profile>()
	@computed get profile() { return loading.payload(this.profileLoad) }

	private logger: Logger
	private profileMagistrate: ProfileMagistrateTopic

	private ticketbooth = makeTicketbooth()
	private getAuthContext: GetAuthContext = null

	constructor(options: {
			logger: Logger
			profileMagistrate: ProfileMagistrateTopic
		}) {
		Object.assign(this, options)
	}

	 @action.bound
	private setProfileLoad(load: loading.Load<Profile>) {
		this.profileLoad = load
	}

	 @action.bound
	async saveProfile(profile: Profile) {
		const {accessToken} = await this.getAuthContext()
		await this.profileMagistrate.setProfile({accessToken, profile})
		this.setProfileLoad(loading.ready(profile))
	}

	 @action.bound
	async handleAuthLoad(authLoad: loading.Load<AuthPayload>) {
		const authPayload = loading.payload(authLoad)
		this.getAuthContext = authPayload?.getAuthContext || null
		const loggedIn = !!authPayload?.user
		if (loggedIn) {
			try {
				this.setProfileLoad(loading.loading())
				const {user} = await this.getAuthContext()
				const {userId} = user
				const sessionStillValid = this.ticketbooth.pullSession()
				const profile = await this.profileMagistrate.getProfile({userId})
				if (sessionStillValid()) {
					this.setProfileLoad(loading.ready(profile))
					this.logger.debug("profile loaded")
				}
				else this.logger.debug("profile discarded, outdated session")
			}
			catch (error) {
				this.setProfileLoad(loading.error("error loading profile"))
				throw error
			}
		}
		else {
			this.setProfileLoad(loading.none())
		}
	}
}
