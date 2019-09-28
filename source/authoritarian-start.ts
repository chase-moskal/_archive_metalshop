
import {TokenStorageTopic, ProfilerTopic} from "authoritarian/dist/interfaces"
import {createTokenStorageCrosscallClient, createProfilerCacheCrosscallClient} from "authoritarian/dist/clients.js"

import {decodeAccessToken as defaultDecodeAccessToken} from "./toolbox/decode-access-token.js"
import {AccountPopupLogin, DecodeAccessToken} from "./interfaces.js"
import {accountPopupLogin as defaultAccountPopupLogin} from "./integrations/account-popup-login.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfilePanel} from "./components/profile-panel.js"

export async function authoritarianStart(options: {
	userPanel?: UserPanel
	userButton?: UserButton
	profilePanel?: ProfilePanel
	profiler?: ProfilerTopic
	tokenStorage?: TokenStorageTopic
	accountPopupLogin?: AccountPopupLogin
	decodeAccessToken?: DecodeAccessToken
} = {}) {
	const {
		userPanel = document.querySelector<UserPanel>("user-panel"),
		userButton = document.querySelector<UserButton>("user-button"),
		profilePanel = document.querySelector<ProfilePanel>("profile-panel"),
		profiler = await createProfilerCacheCrosscallClient({
			url: `${profilePanel.server}/html/profiler-cache`
		}),
		tokenStorage = await createTokenStorageCrosscallClient({
			url: `${userPanel.server}/html/token-storage`
		}),
		accountPopupLogin = defaultAccountPopupLogin,
		decodeAccessToken = defaultDecodeAccessToken,
	} = options

	if (profilePanel)
		await profilePanel.start({profiler})

	if (userPanel)
		await userPanel.start({
			tokenStorage,
			accountPopupLogin,
			decodeAccessToken,
		})
}
