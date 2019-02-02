
import {consoleCurry} from "./console-curry"
import {AuthPanelStore} from "./stores/auth-panel-store"
import {installAuthMachinery} from "./top-level/install-auth-machinery"

const debug = consoleCurry({
	tag: "main",
	consoleFunction: console.debug
})

main().catch(error => console.error(error))

async function main() {
	await installAuthMachinery({
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
			debug(`verifyAndReadAccessToken`)
			return {
				name: "Chase Moskal",
				profilePicture: "chase.jpg"
			}
		}
	})

	console.log("🤖")
}
