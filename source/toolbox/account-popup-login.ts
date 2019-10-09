
import {AuthTokens} from "authoritarian/dist/interfaces.js"
import {AccountPopupLogin} from "../system/interfaces"

import {AuthoritarianAuthError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianAuthError(message)

const namespace = "authoritarian-account-popup"

export function prepareLoginPopupRoutine(
	authServerUrl: string,
	accountPopupLoginFunc: AccountPopupLogin
) {
	return async() => accountPopupLoginFunc(authServerUrl)
}

export async function accountPopupLogin(authServerUrl: string) {
	const {origin: authServerOrigin} = new URL(authServerUrl)
	const popup = window.open(`${authServerOrigin}/html/account-popup`, namespace, popupFeatures(), true)
	popup.focus()

	const promisedAuthTokens = new Promise<AuthTokens>((resolve, reject) => {
		const listener = (event: MessageEvent) => {
			try {

				// security: make sure the origins match
				const originsMatch = event.origin.toLowerCase() === authServerOrigin.toLowerCase()
				const correctMessage = typeof event.data === "object"
					&& "namespace" in event.data
					&& event.data.namespace === namespace
				const allowed = originsMatch && correctMessage
				if (!allowed) return

				// respond to handshake so the server can learn our origin
				if (event.data.handshake) {
					popup.postMessage({
						namespace,
						handshake: true
					}, authServerOrigin)
				}

				// getting those sweet tokens we've been waiting for
				else if (event.data.tokens) {
					const tokens: AuthTokens = event.data.tokens
					window.removeEventListener("message", listener)
					popup.close()
					resolve(tokens)
				}

				else {
					throw err(`${namespace}: unknown message`)
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

function popupFeatures(width = 260, height = 260) {
	const {outerWidth, outerHeight, screenY, screenX} = window.top
	const top = ((outerHeight / 2) + screenY - (height / 2)) / 2
	const left = (outerWidth / 2) + screenX - (width / 2)
	return `
		width=${width},
		height=${height},
		top=${top},
		left=${left},
		toolbar=no,
		location=no,
		status=no,
		menubar=no,
		scrollbars=yes,
		resizable=yes
	`
}
