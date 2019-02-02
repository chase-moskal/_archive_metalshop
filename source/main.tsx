
import {consoleCurry} from "./refactor/console-curry"
import {renderAuthPanel} from "./refactor/render-auth-panel"
import {AuthPanelStore} from "./refactor/stores/auth-panel-store"
import {prepAuthLogout} from "./refactor/auth-machinery/prep-auth-logout"
import {prepAuthPassiveCheck} from "./refactor/auth-machinery/prep-auth-passive-check"
import {prepAuthPromptUserLogin} from "./refactor/auth-machinery/prep-auth-prompt-user-login"
import {prepAuthHandleAccessToken} from "./refactor/auth-machinery/prep-auth-handle-access-token"

const debug = consoleCurry({
	tag: "main",
	consoleFunction: console.debug
})

const generateMocks = () => ({
	tokenApi: {
		async obtainAccessToken() {
			debug(`obtainAccessToken`)
			return "a123"
		},
		async clearTokens() {
			debug(`clearTokens`)
			return null
		}
	},
	loginApi: {
		async userLoginRoutine() {
			debug(`userLoginRoutine`)
			return "a123"
		}
	},
	verifyAndReadAccessToken: () => {
		debug(`verifyAndReadAccessToken`)
		return {
			name: "Chase Moskal",
			profilePicture: "chase.jpg"
		}
	}
})

main().catch(error => console.error(error))

///////////////////////////////////////////////////
////// NEW COOL MAIN //////////////////////////////
///////////////////////////////////////////////////

async function main() {
	// bring in some mock functionality to work with
	const {
		tokenApi,
		loginApi,
		verifyAndReadAccessToken
	} = generateMocks()

	// create the mobx store for the ui
	const panelStore = new AuthPanelStore()

	// define how to handle access token changes
	// (update the store for the ui)
	const authHandleAccessToken = prepAuthHandleAccessToken({
		decodeAccessToken: verifyAndReadAccessToken,
		handleAccessData: profile => panelStore.setUserProfile(profile),
	})

	// wire up auth functions
	const authLogout = prepAuthLogout({tokenApi, authHandleAccessToken})
	const authPassiveCheck = prepAuthPassiveCheck({tokenApi, authHandleAccessToken})
	const authPromptUserLogin = prepAuthPromptUserLogin({loginApi, authHandleAccessToken})

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

	console.log("🤖")
}

///////////////////////////////////////////////////
////// OLD MAIN ///////////////////////////////////
///////////////////////////////////////////////////

// async function old_main() {
// 	const panelStore = new AuthPanelStore()

// 	preact.render(
// 		<AuthPanel {...{
// 			panelStore,
// 			handleUserLogin: () => {
// 				debug(`handleUserLogin`)
// 				authMachine.promptUserLogin()
// 			},
// 			handleUserLogout: () => {
// 				debug(`handleUserLogout`)
// 				authMachine.logout()
// 			}
// 		}}/>,
// 		null,
// 		document.querySelector(".auth-panel")
// 	)

// 	const authMachine = new AuthMachine({
// 		tokenApi: {
// 			async obtainAccessToken() {
// 				debug(`obtainAccessToken`)
// 				return "a123"
// 			},
// 			async clearTokens() {
// 				debug(`clearTokens`)
// 				return null
// 			}
// 		},
// 		loginApi: {
// 			async userLoginRoutine() {
// 				debug(`userLoginRoutine`)
// 				return "a123"
// 			}
// 		},
// 		verifyAndReadAccessToken: () => {
// 			debug(`verifyAndReadAccessToken`)
// 			return {
// 				name: "Chase Moskal",
// 				profilePicture: "chase.jpg"
// 			}
// 		},
// 		updateUserProfile: (userProfile: UserProfile) =>
// 			panelStore.setUserProfile(userProfile)
// 	})

// 	authMachine.passiveAuth()

// 	console.log("🤖")
// }
