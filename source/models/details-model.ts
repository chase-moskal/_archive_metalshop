
import * as loading from "../toolbox/loading.js"
import {observable, action, computed} from "mobx"
import {GetAuthContext, AuthPayload} from "../interfaces.js"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"
import {ProfileMagistrateTopic, Profile, SettingsSheriffTopic, Settings} from "authoritarian/dist/interfaces.js"

export class DetailsModel {
	@observable profileLoad = loading.load<Profile>()
	@observable settingsLoad = loading.load<Settings>()
	@computed get profile() { return loading.payload(this.profileLoad) }
	@computed get settings() { return loading.payload(this.settingsLoad) }

	private getAuthContext: GetAuthContext

	private _ticket: number = 0
	private getTicket = () => this._ticket
	private incrementTicket = () => {
		this._ticket += 1
		return this._ticket
	}

	private logger: Logger
	private settingsSheriff: SettingsSheriffTopic
	private profileMagistrate: ProfileMagistrateTopic

	constructor(options: {
			logger: Logger
			settingsSheriff: SettingsSheriffTopic
			profileMagistrate: ProfileMagistrateTopic
		}) {
		Object.assign(this, options)
	}

	@action.bound async saveProfile(profile: Profile) {
		const {accessToken} = await this.getAuthContext()
		await this.profileMagistrate.setProfile({accessToken, profile})
		this.setProfileLoad(loading.ready(profile))
	}

	@action.bound async handleAuthLoad(authLoad: loading.Load<AuthPayload>) {
		this.getAuthContext = null
		const {
			logger,
			getTicket,
			setProfileLoad,
			setSettingsLoad,
			settingsSheriff,
			incrementTicket,
			profileMagistrate,
		} = this
		const setAll = (load: loading.Load<any>) => {
			setProfileLoad(load)
			setSettingsLoad(load)
		}
		loading.select(authLoad, {
			none: () => setAll(loading.none()),
			loading: () => setAll(loading.loading()),
			error: reason => setAll(loading.error(reason)),
			ready: async({getAuthContext}) => {
				this.getAuthContext = getAuthContext
				const {user, accessToken} = await getAuthContext()
				const {userId} = user
				const ticket = incrementTicket()
				const sessionStillValid = () => ticket === getTicket()

				async function loadSettings() {
					try {
						setSettingsLoad(loading.loading())
						const settings = await settingsSheriff.fetchSettings({accessToken})
						if (sessionStillValid()) {
							setSettingsLoad(loading.ready(settings))
							logger.debug("settings loaded")
							return settings
						}
						else logger.debug("settings discarded, outdated session")
					}
					catch (error) {
						setSettingsLoad(loading.error("error loading settings"))
						throw error
					}
				}

				async function loadProfile() {
					try {
						setProfileLoad(loading.loading())
						const profile = await profileMagistrate.getProfile({userId})
						if (sessionStillValid()) {
							setProfileLoad(loading.ready(profile))
							logger.debug("profile loaded")
							return profile
						}
						else logger.debug("profile discarded, outdated session")
					}
					catch (error) {
						setProfileLoad(loading.error("error loading profile"))
						throw error
					}
				}

				logger.debug("loading settings and profile..")
				await Promise.allSettled([loadSettings(), loadProfile()])
				logger.debug("done loading settings and profile")
			},
		})
	}

	@action.bound private setProfileLoad(load: loading.Load<Profile>) {
		this.profileLoad = load
	}

	@action.bound private setSettingsLoad(load: loading.Load<Settings>) {
		this.settingsLoad = load
	}
}
