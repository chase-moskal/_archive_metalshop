
import {AuthTokens} from "authoritarian/dist/interfaces.js"

const accountPopupNamespace = "authoritarian-account-popup"

export async function accountPopupLogin(authServerUrl: string) {
	const {origin: authServerOrigin} = new URL(authServerUrl)
	const popup = window.open(`${authServerOrigin}/html/account-popup`, accountPopupNamespace, "", true)

	const promisedAuthTokens = new Promise<AuthTokens>((resolve, reject) => {
		const listener = (event: MessageEvent) => {
			try {

				// security: make sure the origins match
				const originsMatch = event.origin.toLowerCase() === authServerOrigin.toLowerCase()
				const correctMessage = typeof event.data === "object"
					&& "namespace" in event.data
					&& event.data.namespace === accountPopupNamespace
				const allowed = originsMatch && correctMessage
				if (!allowed) return

				// respond to handshake so the server can learn our origin
				if (event.data.handshake) {
					popup.postMessage({
						namespace: accountPopupNamespace,
						handshake: true
					}, authServerOrigin)
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
