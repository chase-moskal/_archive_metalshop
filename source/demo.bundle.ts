
import {autorun, configure} from "mobx"

import {makeMocks} from "./make-mocks"
import {installAuth} from "./top-level/install-auth"
import {consoleCurry} from "./toolbox/console-curry"

const info = consoleCurry("main", console.info)
const debug = consoleCurry("main", console.debug)

const mocks = makeMocks({logger: debug})

demo().catch(error => console.error(error))

/**
 * Demonstration of authoritarian-client
 */
async function demo() {
	configure({enforceActions: "never"})

	const {authController} = installAuth({
		element: document.querySelector(".menu-system"),
		...mocks
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
