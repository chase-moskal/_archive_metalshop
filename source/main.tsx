
import {h} from "preact"
import * as preact from "preact"

import {AuthMachine} from "."

import {UserProfile} from "./refactor/interfaces"
import {consoleCurry} from "./refactor/console-curry"
import {AuthPanelStore, AuthPanel} from "./refactor/components/auth-panel"

import {prepAuthLogout} from "./refactor/auth-machinery/prep-auth-logout"
import {prepAuthPassiveCheck} from "./refactor/auth-machinery/prep-auth-passive-check"
import {prepAuthPromptUserLogin} from "./refactor/auth-machinery/prep-auth-prompt-user-login"
import {prepAuthUpdateAccessToken} from "./refactor/auth-machinery/prep-auth-update-access-token"

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
	const authUpdateAccessToken = prepAuthUpdateAccessToken({
		verifyAndReadAccessToken,
		updateUserProfile: profile => panelStore.setUserProfile(profile),
	})

	// wire up auth functions
	const authLogout = prepAuthLogout({tokenApi, authUpdateAccessToken})
	const authPassiveCheck = prepAuthPassiveCheck({tokenApi, authUpdateAccessToken})
	const authPromptUserLogin = prepAuthPromptUserLogin({loginApi, authUpdateAccessToken})

	// render the ui
	// attaching it to the mobx store, and calling auth functions when needed
	preact.render(
		<AuthPanel {...{
			panelStore,
			handleUserLogin: () => {
				debug(`handleUserLogin`)
				authPromptUserLogin()
			},
			handleUserLogout: () => {
				debug(`handleUserLogout`)
				authLogout()
			}
		}}/>,
		null,
		document.querySelector(".auth-panel")
	)

	// perform initial passive auth check
	await authPassiveCheck()

	console.log("🤖")
}

///////////////////////////////////////////////////
////// OLD MAIN ///////////////////////////////////
///////////////////////////////////////////////////

async function old_main() {
	const panelStore = new AuthPanelStore()

	preact.render(
		<AuthPanel {...{
			panelStore,
			handleUserLogin: () => {
				debug(`handleUserLogin`)
				authMachine.promptUserLogin()
			},
			handleUserLogout: () => {
				debug(`handleUserLogout`)
				authMachine.logout()
			}
		}}/>,
		null,
		document.querySelector(".auth-panel")
	)

	const authMachine = new AuthMachine({
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
		},
		updateUserProfile: (userProfile: UserProfile) =>
			panelStore.setUserProfile(userProfile)
	})

	authMachine.passiveAuth()

	console.log("🤖")
}
