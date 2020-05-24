
import {observable, action, computed} from "mobx"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"
import {ProfileMagistrateTopic, SettingsSheriffTopic, Profile} from "authoritarian/dist/interfaces.js"

import * as loading from "../toolbox/loading.js"
import {makeTicketbooth} from "../toolbox/ticketbooth.js"
import {Personal, GetAuthContext, AuthPayload} from "../interfaces.js"

export class PersonalModel {
	@observable personalLoad = loading.load<Personal>()
	@computed get personal() {
		return loading.payload(this.personalLoad)
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
	}

	 @action.bound
	async saveProfile(profile: Profile): Promise<void> {
		const {accessToken} = await this.getAuthContext()
		const {personal} = this
		if (!personal) throw new Error("can't save profile before loading")
		await this.profileMagistrate.setProfile({accessToken, profile})
		const {user, settings} = personal
		this.setPersonalLoad(loading.ready({user, profile, settings}))
	}

	 @action.bound
	async setAdminMode(adminMode: boolean): Promise<void> {
		const {accessToken} = await this.getAuthContext()
		const {personal} = this
		if (!personal) throw new Error("can't save profile before loading")
		const settings = await this.settingsSheriff.setAdminMode({accessToken, adminMode})
		const {user, profile} = personal
		this.setPersonalLoad(loading.ready({user, profile, settings}))
	}

	 @action.bound
	private setPersonalLoad(personalLoad: loading.Load<Personal>) {
		this.personalLoad = personalLoad
	}
}
