
import {autorun, configure} from "mobx"

import {makeAuthMocks} from "./make-auth-mocks"
import {consoleCurry} from "./toolbox/console-curry"
import {renderAuthMenuSystem} from "./routines/render-auth-menu-system"

const info = consoleCurry("main", console.info)
const debug = consoleCurry("main", console.debug)

const mocks = makeAuthMocks({logger: debug})

demo().catch(error => console.error(error))

/**
 * Demonstration of authoritarian-client
 */
async function demo() {
	configure({enforceActions: "never"})

	const {authController} = renderAuthMenuSystem({
		element: document.querySelector(".menu-system"),
		authFundamentals: mocks
	})

	const {authStore} = authController

	// console log for whenever login/logout happens on the store
	autorun(() => authStore.accessData
		? info(`logged in as "${authStore.accessData.name}"`)
		: info(`logged out`)
	)

	// demo script is done
	console.log("🤖")
}
