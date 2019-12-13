
import {AccountPopupLogin} from "../interfaces.js"
import {AuthoritarianAuthError} from "../system/errors.js"
import {AuthTokens} from "authoritarian/dist/interfaces.js"

const err = (message: string) => new AuthoritarianAuthError(message)

// namespace to avoid possible collisions with other global post-messages
const namespace = "authoritarian-account-popup"

/**
 * Curry away the url parameter
 * - prepare the url ahead of time
 * - you provide the mockable account popup login function
 */
export function prepareLoginPopupRoutine(
	authServerUrl: string,
	accountPopupLoginFunc: AccountPopupLogin
) {
	return async() => accountPopupLoginFunc(authServerUrl)
}

/**
 * Trigger an account popup to appear, harvest and return the auth tokens
 * - must be called from user-initiated callstack (like a click event),
 *   otherwise popup blockers will prevent functionality
 * - custom post-message logic communicates with the popup
 * - add a 'message' event listener to window for popup communication
 */
export async function accountPopupLogin(authServerUrl: string):
 Promise<AuthTokens> {

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
		popup.postMessage({}, authServerOrigin)
	})

	return promisedAuthTokens
}

/**
 * Features to place popup center screen
 */
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
