
import {autorun} from "mobx"

import {consoleCurry} from "./toolbox/console-curry"
import {AuthPanelStore} from "./stores/auth-panel-store"
import {installAuthoritarianClient} from "./top-level/install-authoritarian-client"

const debug = consoleCurry({
	tag: "main",
	consoleFunction: console.debug
})

const info = consoleCurry({
	tag: "main",
	consoleFunction: console.info
})

demo().catch(error => console.error(error))

/**
 * Demonstration of authoritarian-client
 */
async function demo() {

	// create panel store which holds ui state
	const panelStore = new AuthPanelStore()

	// console log for whenever login/logout happens on the store
	autorun(() => panelStore.accessData
		? info(`logged in as "${panelStore.accessData.name}"`)
		: info(`logged out`)
	)

	// install the client machinery and panel ui
	await installAuthoritarianClient({
		panelStore,
		element: document.querySelector(".auth-panel"),
		tokenApi: {
			async obtainAccessToken() { debug(`obtainAccessToken`); return "a123" },
			async clearTokens() { debug(`clearTokens`); return null }
		},
		loginApi: {
			async userLoginRoutine() { debug(`userLoginRoutine`); return "a123" }
		},
		decodeAccessToken: () => {
			debug(`decodeAccessToken`)
			return {
				name: "Chase Moskal",
				profilePicture: "chase.jpg"
			}
		}
	})

	// demo script is done
	console.log("🤖")
}
