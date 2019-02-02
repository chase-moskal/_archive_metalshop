
import {h} from "preact"
import * as preact from "preact"

import {AuthMachine} from "."

import {consoleCurry} from "./refactor/console-curry"
import {AuthPanelStore, AuthPanel} from "./refactor/components/auth-panel"

const debug = consoleCurry({
	tag: "main",
	consoleFunction: console.debug
})

main().catch(error => console.error(error))

async function main() {

	const authMachine = new AuthMachine({
		panelStore: new AuthPanelStore(),
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

	authMachine.passiveAuth()

	const {panelStore} = authMachine

	const handleUserLogin = () => {
		debug(`handleUserLogin`)
		authMachine.userPromptLogin()
	}

	const handleUserLogout = () => {
		debug(`handleUserLogout`)
		authMachine.logout()
	}

	preact.render(
		<AuthPanel {...{panelStore, handleUserLogin, handleUserLogout}}/>,
		null,
		document.querySelector(".auth-panel")
	)

	console.log("🤖")
}
