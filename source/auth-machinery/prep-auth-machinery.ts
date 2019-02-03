
import {PrepAuthMachineryOptions} from "./interfaces"

import {prepAuthLogout} from "./prep-auth-logout"
import {prepAuthPassiveCheck} from "./prep-auth-passive-check"
import {prepAuthPromptUserLogin} from "./prep-auth-prompt-user-login"
import {prepAuthHandleAccessToken} from "./prep-auth-handle-access-token"

export function prepAuthMachinery({
	tokenApi,
	loginApi,
	handleAccessData,
	decodeAccessToken
}: PrepAuthMachineryOptions) {

	const authHandleAccessToken = prepAuthHandleAccessToken({
		decodeAccessToken,
		handleAccessData
	})

	return {
		authLogout: prepAuthLogout({
			tokenApi,
			authHandleAccessToken
		}),
		authPassiveCheck: prepAuthPassiveCheck({
			tokenApi,
			authHandleAccessToken
		}),
		authPromptUserLogin: prepAuthPromptUserLogin({
			loginApi,
			authHandleAccessToken
		})
	}
}
