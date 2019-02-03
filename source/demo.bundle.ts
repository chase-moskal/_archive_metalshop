
import {autorun} from "mobx"

import {mocks} from "./auth-machinery/mocks"
import {consoleCurry} from "./toolbox/console-curry"
import {AuthPanelStore} from "./stores/auth-panel-store"
import {installAuthoritarianClient} from "./top-level/install-authoritarian-client"

const info = consoleCurry("main", console.info)
const debug = consoleCurry("main", console.debug)

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
			async obtainAccessToken(...args) {
				debug(`obtainAccessToken`)
				return mocks.tokenApi.good.obtainAccessToken(...args)
			},
			async clearTokens(...args) {
				debug(`clearTokens`)
				return mocks.tokenApi.good.clearTokens(...args)
			}
		},
		loginApi: {
			async userLoginRoutine(...args) {
				debug(`userLoginRoutine`)
				return mocks.loginApi.good.userLoginRoutine(...args)
			}
		},
		decodeAccessToken: (...args) => {
			debug(`decodeAccessToken`)
			return mocks.decodeAccessToken.good(...args)
		}
	})

	// demo script is done
	console.log("🤖")
}
