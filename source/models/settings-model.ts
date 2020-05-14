
import * as loading from "../toolbox/loading.js"
import {observable, action, computed} from "mobx"
import {makeTicketbooth} from "../toolbox/ticketbooth.js"
import {GetAuthContext, AuthPayload} from "../interfaces.js"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"
import {SettingsSheriffTopic, Settings} from "authoritarian/dist/interfaces.js"

export class SettingsModel {
	@observable settingsLoad = loading.load<Settings>()
	@computed get settings() { return loading.payload(this.settingsLoad) }
	private logger: Logger
	private settingsSheriff: SettingsSheriffTopic
	private ticketbooth = makeTicketbooth()
	private getAuthContext: GetAuthContext = null

	constructor({logger, settingsSheriff}: {
			logger: Logger
			settingsSheriff: SettingsSheriffTopic
		}) {
		this.logger = logger
		this.settingsSheriff = settingsSheriff
	}

	 @action.bound
	private setSettingsLoad(load: loading.Load<Settings>) {
		this.settingsLoad = load
	}

	 @action.bound
	async setAdminMode(adminMode: boolean) {
		try {
			this.setSettingsLoad(loading.loading())
			const {accessToken} = await this.getAuthContext()
			const settings = await this.settingsSheriff.setAdminMode({
				adminMode,
				accessToken,
			})
			this.setSettingsLoad(loading.ready(settings))
		}
		catch (error) {
			this.setSettingsLoad(loading.error())
			this.logger.error(error)
		}
	}

	 @action.bound
	async handleAuthLoad(authLoad: loading.Load<AuthPayload>) {
		const authPayload = loading.payload(authLoad)
		this.getAuthContext = authPayload?.getAuthContext || null
		const loggedIn = !!authPayload?.user
		if (loggedIn) {
			try {
				this.setSettingsLoad(loading.loading())
				const {accessToken} = await this.getAuthContext()
				const sessionStillValid = this.ticketbooth.pullSession()
				const settings = await this.settingsSheriff.fetchSettings({accessToken})
				if (sessionStillValid()) {
					this.setSettingsLoad(loading.ready(settings))
					this.logger.debug("settings loaded")
				}
			}
			catch (error) {
				this.setSettingsLoad(loading.error())
				this.logger.error(error)
			}
		}
		else {
			this.setSettingsLoad(loading.none())
		}
	}
}
