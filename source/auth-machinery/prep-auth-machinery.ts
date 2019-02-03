
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

	const handleAccessToken = prepHandleAccessToken({
		handleAccessData,
		decodeAccessToken
	})

	return {
		logout: prepLogout({tokenApi, handleAccessToken}),
		passiveCheck: prepPassiveCheck({tokenApi, handleAccessToken}),
		promptUserLogin: prepPromptUserLogin({loginApi, handleAccessToken})
	}
}
