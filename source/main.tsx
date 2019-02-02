
import {h} from "preact"
import * as preact from "preact"

import {AuthMachine} from "."

import {consoleCurry} from "./refactor/console-curry"
import {AuthPanelStore, AuthPanel} from "./refactor/components/auth-panel"
import {UserProfile} from "./refactor/interfaces"

import {hocAuthLogout} from "./refactor/auth-machinery/hoc-auth-logout"
import {hocAuthPassiveCheck} from "./refactor/auth-machinery/hoc-auth-passive-check"
import {hocAuthPromptUserLogin} from "./refactor/auth-machinery/hoc-auth-prompt-user-login"
import {hocAuthUpdateAccessToken} from "./refactor/auth-machinery/hoc-auth-update-access-token"

const debug = consoleCurry({
	tag: "main",
	consoleFunction: console.debug
})

main().catch(error => console.error(error))

async function main() {
	const tokenApi = {
		async obtainAccessToken() {
			debug(`obtainAccessToken`)
			return "a123"
		},
		async clearTokens() {
			debug(`clearTokens`)
			return null
		}
	}

	const loginApi = {
		async userLoginRoutine() {
			debug(`userLoginRoutine`)
			return "a123"
		}
	}

	const verifyAndReadAccessToken = () => {
		debug(`verifyAndReadAccessToken`)
		return {
			name: "Chase Moskal",
			profilePicture: "chase.jpg"
		}
	}

	const panelStore = new AuthPanelStore()

	const updateUserProfile = (userProfile: UserProfile) =>
		panelStore.setUserProfile(userProfile)

	const authUpdateAccessToken = hocAuthUpdateAccessToken({
		updateUserProfile,
		verifyAndReadAccessToken
	})

	const authLogout = hocAuthLogout({tokenApi, authUpdateAccessToken})
	const authPromptUserLogin = hocAuthPromptUserLogin({loginApi, authUpdateAccessToken})

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

	const authPassiveCheck = hocAuthPassiveCheck({tokenApi, authUpdateAccessToken})
	authPassiveCheck()

	console.log("🤖")
}

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
