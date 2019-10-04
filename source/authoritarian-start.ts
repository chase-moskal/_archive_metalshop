
import {TokenStorageTopic, ProfilerTopic, PaywallGuardianTopic} from "authoritarian/dist/interfaces.js"
import {createTokenStorageCrosscallClient, createProfilerCacheCrosscallClient} from "authoritarian/dist/clients.js"

import {selects, select} from "./toolbox/selects.js"
import {createEventListener} from "./toolbox/create-event-listener.js"
import {decodeAccessToken as defaultDecodeAccessToken} from "./toolbox/decode-access-token.js"
import {AccountPopupLogin, DecodeAccessToken} from "./interfaces.js"
import {accountPopupLogin as defaultAccountPopupLogin} from "./integrations/account-popup-login.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfilePanel} from "./components/profile-panel.js"
import {PaywallPanel} from "./components/paywall-panel.js"

import {UserModel} from "./models/user-model.js"
import {ProfileModel} from "./models/profile-model.js"
import {createPaywallModel} from "./models/paywall-model.js"
import {UserLoginEvent, UserLogoutEvent, UserErrorEvent} from "./events.js"

export async function authoritarianStart(options: {
	config?: Element
	profilerUrl?: string
	authServerUrl?: string
	paywallGuardianUrl?: string

	eventTarget?: EventTarget
	userPanels?: UserPanel[]
	userButtons?: UserButton[]
	profilePanels?: ProfilePanel[]

	profiler?: ProfilerTopic
	paywallGuardian?: PaywallGuardianTopic
	tokenStorage?: TokenStorageTopic
	accountPopupLogin?: AccountPopupLogin
	decodeAccessToken?: DecodeAccessToken
} = {}) {

	//
	// get config, defaults, and mocks
	//

	const getConfig = (key: string, element: Element) => element.getAttribute(key)
	const {
		config = select("authoritarian-config"),
		eventTarget = document.body,
		userPanels = selects<UserPanel>("user-panel"),
		userButtons = selects<UserButton>("user-button"),
		profilePanels = selects<ProfilePanel>("profile-panel"),
		accountPopupLogin = defaultAccountPopupLogin,
		decodeAccessToken = defaultDecodeAccessToken,
	} = options
	if (!config) throw new Error(`<authoritarian-config> element required`)
	const userModelConfig = select("user-model", config)
	const profileModelConfig = select("profile-model", config)
	const paywallModelConfig = select("paywall-model", config)
	let promises: Promise<void>[] = []

	//
	// profile model
	//

	if (profileModelConfig) {
		const {
			profilerUrl = getConfig("url", profileModelConfig),
			profiler = await createProfilerCacheCrosscallClient({
				url: `${profilerUrl}/html/profiler-cache`
			})
		} = options
		const profileModel = new ProfileModel({
			profiler,
			eventTarget,
		})
	}

	//
	// user model
	//

	if (userModelConfig) {
		const {
			authServerUrl = getConfig("url", userModelConfig),
			tokenStorage = await createTokenStorageCrosscallClient({
				url: `${authServerUrl}/html/token-storage`
			})
		} = options
		const userModel = new UserModel({
			eventTarget,
			tokenStorage,
			authServerUrl,
			accountPopupLogin,
			decodeAccessToken,
		})
		for (const userPanel of userPanels) {
			userPanel.onLoginClick = userModel.login
			userPanel.onLogoutClick = userModel.logout
		}
		promises.push(userModel.start())

		//
		// paywall model
		//

		if (paywallModelConfig) {
			const {
				paywallGuardianUrl = getConfig("url", profileModelConfig),
				paywallGuardian = null
			} = options

			// selecting the ui components
			const paywallPanels = selects<PaywallPanel>("paywall-panel")

			// creating the paywall model
			const {appAccess, componentAccess} = createPaywallModel({
				paywallGuardian,
				onStateUpdate: () => {
					for (const panel of paywallPanels)
						panel.requestUpdate()
				},
				handleNewAccessToken: userModel.handleNewAccessToken
			})

			// give each panel the component access object
			for (const panel of paywallPanels)
				panel.access = componentAccess

			// wiring user events to app access actions
			createEventListener(UserLoginEvent, window, {}, event => {
				const {getAuthContext} = event.detail
				appAccess.actions.notifyUserLogin({getAuthContext})
			})
			createEventListener(UserLogoutEvent, window, {}, () => {
				appAccess.actions.notifyUserLogout()
			})
			createEventListener(UserErrorEvent, window, {}, () => {
				appAccess.actions.notifyUserLogout()
			})
		}
	}

	await Promise.all(promises)
}
