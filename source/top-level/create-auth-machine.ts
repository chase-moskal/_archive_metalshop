
import {prepLogout} from "../auth-machinery/prep-logout"
import {AuthPanelStore} from "../stores/auth-panel-store"
import {prepPassiveCheck} from "../auth-machinery/prep-passive-check"
import {prepPromptUserLogin} from "../auth-machinery/prep-prompt-user-login"
import {prepHandleAccessToken} from "../auth-machinery/prep-handle-access-token"

import {CreateAuthMachineOptions, AuthMachine} from "./interfaces"

export function createAuthMachine({
	tokenApi,
	loginApi,
	panelStore,
	decodeAccessToken
}: CreateAuthMachineOptions): AuthMachine {

	const handleAccessToken = prepHandleAccessToken({
		decodeAccessToken,
		handleAccessData: data => panelStore.setAccessData(data)
	})

	return {
		panelStore,
		logout: prepLogout({tokenApi, handleAccessToken}),
		passiveCheck: prepPassiveCheck({tokenApi, handleAccessToken}),
		promptUserLogin: prepPromptUserLogin({loginApi, handleAccessToken})
	}
}
