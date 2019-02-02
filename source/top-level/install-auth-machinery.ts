
import {consoleCurry} from "../console-curry"
import {DecodeAccessToken} from "../interfaces"
import {AuthPanelStore} from "../stores/auth-panel-store"
import {TokenApi, LoginApi} from "../auth-machinery/interfaces"
import {prepAuthLogout} from "../auth-machinery/prep-auth-logout"
import {prepAuthPassiveCheck} from "../auth-machinery/prep-auth-passive-check"
import {prepAuthPromptUserLogin} from "../auth-machinery/prep-auth-prompt-user-login"
import {prepAuthHandleAccessToken} from "../auth-machinery/prep-auth-handle-access-token"
import {renderAuthPanel} from "./render-auth-panel"

const debug = consoleCurry({
	tag: "install-auth-machinery",
	consoleFunction: console.debug
})

export async function installAuthMachinery({
	tokenApi,
	loginApi,
	decodeAccessToken,
	panelStore = new AuthPanelStore()
}: {
	tokenApi: TokenApi
	loginApi: LoginApi
	decodeAccessToken: DecodeAccessToken
	panelStore?: AuthPanelStore
}) {

	// create auth token handler to decode token and provide it to the ui
	const authHandleAccessToken = prepAuthHandleAccessToken({
		decodeAccessToken,
		handleAccessData: profile => panelStore.setAccessData(profile),
	})

	// wire up auth functions
	const authLogout = prepAuthLogout({tokenApi, authHandleAccessToken})
	const authPassiveCheck = prepAuthPassiveCheck({tokenApi, authHandleAccessToken})
	const authPromptUserLogin = prepAuthPromptUserLogin({loginApi, authHandleAccessToken})

	// render the auth panel and react using the auth machinery
	renderAuthPanel({
		panelStore,
		element: document.querySelector(".auth-panel"),
		handleUserLogin: () => {
			debug(`handleUserLogin`)
			authPromptUserLogin()
		},
		handleUserLogout: () => {
			debug(`handleUserLogout`)
			authLogout()
		}
	})

	// perform initial passive auth check
	await authPassiveCheck()
}
