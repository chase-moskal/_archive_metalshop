
import {PrepAuthMachineryOptions} from "./interfaces"

import {prepLogout} from "./prep-logout"
import {prepPassiveCheck} from "./prep-passive-check"
import {prepPromptUserLogin} from "./prep-prompt-user-login"
import {prepHandleAccessToken} from "./prep-handle-access-token"

export function prepAuthMachinery({
	tokenApi,
	loginApi,
	handleAccessData,
	decodeAccessToken
}: PrepAuthMachineryOptions) {

	const authHandleAccessToken = prepHandleAccessToken({
		handleAccessData,
		decodeAccessToken
	})

	return {
		logout: prepLogout({
			tokenApi,
			authHandleAccessToken
		}),
		passiveCheck: prepPassiveCheck({
			tokenApi,
			handleAccessToken: authHandleAccessToken
		}),
		promptUserLogin: prepPromptUserLogin({
			loginApi,
			handleAccessToken: authHandleAccessToken
		})
	}
}
