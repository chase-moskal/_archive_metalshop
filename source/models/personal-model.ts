
import {observable, action, computed} from "mobx"
import {Personal} from "authoritarian/dist/interfaces.js"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"
import {ProfileMagistrateTopic, SettingsSheriffTopic, Profile} from "authoritarian/dist/interfaces.js"

import * as loading from "../toolbox/loading.js"
import {makeTicketbooth} from "../toolbox/ticketbooth.js"
import {GetAuthContext, AuthPayload} from "../interfaces.js"

export class PersonalModel {
	@observable personalLoad = loading.load<Personal>()
	@computed get personal() {
		return loading.payload(this.personalLoad)
	}
	@computed get profile() {
		return this.personal?.profile
	}
	@computed get settings() {
		return this.personal?.settings
	}

	private logger: Logger
	private settingsSheriff: SettingsSheriffTopic
	private profileMagistrate: ProfileMagistrateTopic

	private ticketbooth = makeTicketbooth()
	private getAuthContext: GetAuthContext = null

	constructor({logger, settingsSheriff, profileMagistrate}: {
			logger: Logger
			settingsSheriff: SettingsSheriffTopic
			profileMagistrate: ProfileMagistrateTopic
		}) {
		this.logger = logger
		this.settingsSheriff = settingsSheriff
		this.profileMagistrate = profileMagistrate
	}

	 @action.bound
	async handleAuthLoad(authLoad: loading.Load<AuthPayload>) {
		const authPayload = loading.payload(authLoad)
		this.getAuthContext = authPayload?.getAuthContext || null
		const loggedIn = !!authPayload?.user
		if (loggedIn) {
			try {
				this.setPersonalLoad(loading.loading())
				const {user, accessToken} = await this.getAuthContext()
				const {userId} = user
				const sessionStillValid = this.ticketbooth.pullSession()
				const profile = await this.profileMagistrate.getProfile({userId})
				const settings = await this.settingsSheriff.fetchSettings({accessToken})
				if (sessionStillValid()) {
					this.setPersonalLoad(loading.ready({user, profile, settings}))
					this.logger.debug("personal loaded")
				}
				else this.logger.debug("personal discarded")
			}
			catch (error) {
				this.setPersonalLoad(loading.error("error loading personal"))
				console.error(error)
			}
		}
		else {
			this.setPersonalLoad(loading.none())
		}
	}

	 @action.bound
	async saveProfile(profile: Profile): Promise<void> {
		if (!this.personal) throw new Error("personal not loaded")
		const {accessToken} = await this.getAuthContext()
		await this.profileMagistrate.setProfile({accessToken, profile})
		const {user, settings} = this.personal
		this.setPersonalLoad(loading.ready({user, profile, settings}))
	}

	 @action.bound
	async setAdminMode(adminMode: boolean): Promise<void> {
		if (!this.personal) throw new Error("personal not loaded")
		const {accessToken} = await this.getAuthContext()
		const settings = await this.settingsSheriff.setAdminMode({accessToken, adminMode})
		const {user, profile} = this.personal
		this.setPersonalLoad(loading.ready({user, profile, settings}))
	}

	 @action.bound
	async setAvatarPublicity(avatarPublicity: boolean): Promise<void> {
		if (!this.personal) throw new Error("personal not loaded")
		const {user, accessToken} = await this.getAuthContext()
		const {settings, profile} = await this.settingsSheriff.setAvatarPublicity({
			accessToken,
			avatarPublicity,
		})
		this.setPersonalLoad(loading.ready({user, profile, settings}))
	}

	 @action.bound
	private setPersonalLoad(personalLoad: loading.Load<Personal>) {
		this.personalLoad = personalLoad
	}
}
