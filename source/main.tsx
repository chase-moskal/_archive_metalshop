
import {consoleCurry} from "./toolbox/console-curry"
import {AuthPanelStore} from "./stores/auth-panel-store"
import {installAuthoritarianClient} from "./top-level/install-authoritarian-client"

const debug = consoleCurry({
	tag: "main",
	consoleFunction: console.debug
})

main().catch(error => console.error(error))

async function main() {
	await installAuthoritarianClient({
		element: document.querySelector(".auth-panel"),

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

		decodeAccessToken: () => {
			debug(`decodeAccessToken`)
			return {
				name: "Chase Moskal",
				profilePicture: "chase.jpg"
			}
		}
	})

	console.log("🤖")
}
