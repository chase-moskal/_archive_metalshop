
import {
	createProfilerCacheCrosscallClient,
	createTokenStorageCrosscallClient
} from "authoritarian/dist/clients.js"

import {
	prepareLoginPopupRoutine,
	accountPopupLogin as defaultAccountPopupLogin,
} from "./toolbox/account-popup-login.js"
import {
	decodeAccessToken as defaultDecodeAccessToken,
} from "./toolbox/decode-access-token.js"

import {selects, select} from "./toolbox/selects.js"
import {createEventListener} from "./toolbox/create-event-listener.js"

import {createPaywallModel} from "./models/paywall-model.js"
import {createUserModel} from "./models/user-model.js"
import {createProfileModel} from "./models/profile-model.js"

import {UserPanel} from "./components/user-panel.js"
import {PaywallPanel} from "./components/paywall-panel.js"

import {AuthoritarianOptions} from "./interfaces.js"
import {UserLoginEvent, UserLogoutEvent, UserErrorEvent} from "./events.js"

export async function authoritarianStart(options: AuthoritarianOptions = {}) {
	const eventTarget = document.body
	const config = select("authoritarian-config")
	if (!config) throw new Error(`<authoritarian-config> element required`)
	
	//
	// authoritarian start routine
	//

	// use mocks or passed options
	let {
		profiler,
		tokenStorage,
		paywallGuardian,
		accountPopupLogin = defaultAccountPopupLogin,
		decodeAccessToken = defaultDecodeAccessToken,
	} = {...await getMocks(), ...options}

	// console-log the events
	if (config.hasAttribute("debug"))
		for (const event of [
			"user-error",
			"user-login",
			"user-logout",
			"user-loading",
			"profile-error",
			"profile-update",
		]) window.addEventListener(event, () => console.log(event))

	// perform setups
	await setupProfile()
	const userModel = await setupUser()
	await setupPaywall()
	await userModel.start()

	//
	// detailed functions used above
	//

	async function getMocks() {
		if (!config.hasAttribute("mock")) return {}
		else {
			const {
				MockProfiler,
				MockTokenStorage,
				MockPaywallGuardian,
				mockAccountPopupLogin,
				// mockDecodeAccessToken,
			} = await import("./mocks.js")
			return {
				profiler: new MockProfiler(),
				tokenStorage: new MockTokenStorage(),
				accountPopupLogin: mockAccountPopupLogin,
				paywallGuardian: new MockPaywallGuardian()
				// using the real decodeAccessToken, we have legit mock tokens for it
			}
		}
	}

	async function setupProfile() {
		const profileConfig = select("profile-model", config)
		if (profileConfig) {
			const url = profileConfig.getAttribute("url")
			if (!url) throw new Error("profile-model config requires url")
			profiler = profiler || await createProfilerCacheCrosscallClient({url})
			return createProfileModel({profiler, eventTarget})
		}
	}

	async function setupUser() {
		const userConfig = select("user-model", config)
		if (userConfig) {
			const url = userConfig.getAttribute("url")
			if (!url) throw new Error("user-model config requires url")
			const loginPopupRoutine = prepareLoginPopupRoutine(url, accountPopupLogin)
			tokenStorage = tokenStorage || await createTokenStorageCrosscallClient({
				url: `${url}/html/token-storage`
			})
			const userModel = createUserModel({
				eventTarget,
				tokenStorage,
				loginPopupRoutine,
				decodeAccessToken,
			})
			// grant panels the ability to login and logout
			for (const userPanel of selects<UserPanel>("user-panel")) {
				userPanel.onLoginClick = userModel.login
				userPanel.onLogoutClick = userModel.logout
			}
			return userModel
		}
	}

	async function setupPaywall() {
		const paywallConfig = select("paywall-model", config)
		if (paywallConfig) {
			if (!userModel) throw new Error("paywall-model requires user-model")
			const paywallPanels = selects<PaywallPanel>("paywall-panel")
			const paywallModel = createPaywallModel({
				paywallGuardian,
				onStateUpdate: () => {
					for (const panel of paywallPanels)
						panel.requestUpdate()
				},
				loginWithAccessToken: userModel.loginWithAccessToken
			})
			for (const panel of paywallPanels)
				panel.access = paywallModel.panelAccess
			createEventListener(UserLoginEvent, window, {}, event => {
				const {getAuthContext} = event.detail
				paywallModel.appAccess.actions.notifyUserLogin({getAuthContext})
			})
			createEventListener(UserLogoutEvent, window, {}, () => {
				paywallModel.appAccess.actions.notifyUserLogout()
			})
			createEventListener(UserErrorEvent, window, {}, () => {
				paywallModel.appAccess.actions.notifyUserLogout()
			})
			return paywallModel
		}
	}
}
