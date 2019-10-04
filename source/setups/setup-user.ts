
import {TokenStorageTopic} from "authoritarian/dist/interfaces.js"
import {createTokenStorageCrosscallClient} from "authoritarian/dist/clients.js"

import {select} from "../toolbox/selects.js"
import {UserModel} from "../models/user-model.js"
import {UserPanel} from "../components/user-panel.js"

import {AccountPopupLogin, DecodeAccessToken} from "../interfaces.js"

export async function setupUser({
	config, eventTarget, tokenStorage, accountPopupLogin, decodeAccessToken,
	userPanels,
}: {
	config: Element
	userPanels: UserPanel[]
	eventTarget: EventTarget
	tokenStorage: TokenStorageTopic
	accountPopupLogin: AccountPopupLogin
	decodeAccessToken: DecodeAccessToken
}) {
	const userModelConfig = select("user-model", config)
	if (!userModelConfig) return
	const authServerUrl = userModelConfig.getAttribute("url")
	tokenStorage = tokenStorage || await createTokenStorageCrosscallClient({
		url: `${authServerUrl}/html/token-storage`
	})
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
	await userModel.start()
	return userModel
}
