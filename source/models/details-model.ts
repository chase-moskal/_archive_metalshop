
import {observable, action, computed} from "mobx"
import * as loading from "../toolbox/loading.js"
import {AuthMode, GetAuthContext, AuthUpdate} from "../interfaces.js"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"
import {ProfileMagistrateTopic, Profile, SettingsSheriffTopic, Settings} from "authoritarian/dist/interfaces.js"

const prepareAuthLoggedIn = ({
		logger,
		getTicket,
		getAuthContext,
		setProfileLoad,
		incrementTicket,
		settingsSheriff,
		setSettingsLoad,
		profileMagistrate,
	}: {
		logger: Logger
		getTicket: () => number
		incrementTicket: () => number
		getAuthContext: GetAuthContext
		settingsSheriff: SettingsSheriffTopic
		profileMagistrate: ProfileMagistrateTopic
		setProfileLoad: (load: loading.Load<Profile>) => void
		setSettingsLoad: (load: loading.Load<Settings>) => void
	}) => async function authLoggedIn() {

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
}

export class DetailsModel {
	@observable profileLoad = loading.load<Profile>()
	@observable settingsLoad = loading.load<Settings>()
	@computed get profile() { return loading.payload(this.profileLoad) }
	@computed get settings() { return loading.payload(this.settingsLoad) }

	private getAuthContext: GetAuthContext
	private lastAuthMode: AuthMode

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

	@action.bound private setProfileLoad(load: loading.Load<Profile>) {
		this.profileLoad = load
	}

	@action.bound private setSettingsLoad(load: loading.Load<Settings>) {
		this.settingsLoad = load
	}

	@action.bound async saveProfile(profile: Profile) {
		const {accessToken} = await this.getAuthContext()
		await this.profileMagistrate.setProfile({accessToken, profile})
		this.setProfileLoad(loading.ready(profile))
	}

	@action.bound async handleAuthUpdate({mode, getAuthContext}: AuthUpdate) {
		this.getAuthContext = getAuthContext
		const authModeChanged: boolean = mode === this.lastAuthMode
		this.lastAuthMode = mode
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

		async function authLoggedOut() {
			setAll(loading.none())
		}

		async function authLoading() {
			setAll(loading.loading())
		}

		async function authError() {
			setAll(loading.error("auth error occurred"))
		}

		async function authOtherwise() {
			logger.warn("unknown auth mode")
			setAll(loading.none())
		}

		const authLoggedIn = prepareAuthLoggedIn({
			logger,
			getTicket,
			getAuthContext,
			setProfileLoad,
			setSettingsLoad,
			settingsSheriff,
			incrementTicket,
			profileMagistrate,
		})

		switch (mode) {
			case AuthMode.LoggedIn: await authLoggedIn()
			break; case AuthMode.LoggedOut: await authLoggedOut()
			break; case AuthMode.Loading: await authLoading()
			break; case AuthMode.Error: await authError()
			break; default: await authOtherwise()
		}
	}
}
