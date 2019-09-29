
import {TokenStorageTopic, ProfilerTopic} from "authoritarian/dist/interfaces"
import {createTokenStorageCrosscallClient, createProfilerCacheCrosscallClient} from "authoritarian/dist/clients.js"

import {decodeAccessToken as defaultDecodeAccessToken} from "./toolbox/decode-access-token.js"
import {AccountPopupLogin, DecodeAccessToken} from "./interfaces.js"
import {accountPopupLogin as defaultAccountPopupLogin} from "./integrations/account-popup-login.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfilePanel} from "./components/profile-panel.js"

import {UserModel} from "./models/user-model.js"
import {selects, select} from "./toolbox/selects.js"
import {ProfileModel} from "./models/profile-model.js"

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
	tokenStorage?: TokenStorageTopic
	accountPopupLogin?: AccountPopupLogin
	decodeAccessToken?: DecodeAccessToken
} = {}) {
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
	let promises: Promise<void>[] = []

	if (profileModelConfig) {
		const {
			profilerUrl = getConfig("profiler-url", profileModelConfig),
			profiler = await createProfilerCacheCrosscallClient({
				url: `${profilerUrl}/html/profiler-cache`
			})
		} = options
		const profileModel = new ProfileModel({
			profiler,
			eventTarget,
		})
	}

	if (userModelConfig) {
		const {
			authServerUrl = getConfig("auth-server-url", userModelConfig),
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
	}

	await Promise.all(promises)
}
