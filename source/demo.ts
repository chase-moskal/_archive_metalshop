
import {AuthTokens} from "authoritarian/dist/interfaces.js"

import "menutown/dist/register-all.js"
import "./register-all.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfileSubpanel} from "./components/profile-subpanel.js"

import {
	MockAccountPopup,
	MockTokenStorage,
	MockProfileManager,
	MockPaywallGuardian,
} from "./mocks.js"

const namespace = "authoritarian-login"

async function accountPopupLogin() {
	const origin = "http://localhost:8000"
	const popup = window.open(`${origin}/login`, namespace, "", true)

	const promisedAuthTokens = new Promise<AuthTokens>((resolve, reject) => {
		const listener = (event: MessageEvent) => {
			try {

				// security: make sure the origins match
				const originsMatch = event.origin.toLowerCase() === origin.toLowerCase()
				const correctMessage = typeof event.data === "object"
					&& "namespace" in event.data
					&& event.data.namespace === namespace
				const allowed = originsMatch && correctMessage
				if (!allowed) return

				// respond to handshake so the server can learn our origin
				if (event.data.handshake) {
					popup.postMessage({namespace, handshake: true}, origin)
				}

				// getting those sweet tokens we've been waiting for
				else if (event.data.tokens) {
					const tokens: AuthTokens = event.data.tokens
					window.removeEventListener("message", listener)
					resolve(tokens)
				}

				else {
					throw new Error("unknown message")
				}
			}
			catch (error) {
				reject(error)
			}
		}
		window.addEventListener("message", listener)
	})

	return promisedAuthTokens
}

async function main() {
	const userPanel: UserPanel = document.querySelector("user-panel")
	const userButton: UserButton = document.querySelector("user-button")
	const profileSubpanel: ProfileSubpanel = document.querySelector("profile-subpanel")

	// console-log the events
	for (const event of ["user-login", "user-logout", "profile-loaded"])
		window.addEventListener(event, () => console.log(event))

	// attach mocks instead of real implementations
	userPanel.accountPopupLogin = accountPopupLogin
	userPanel.tokenStorage = new MockTokenStorage()
	profileSubpanel.profileManager = new MockProfileManager()

	// schweet action!
	await userPanel.startup()
}

main()
	.then(() => console.log("🤖"))
	.catch(error => console.error(error))
