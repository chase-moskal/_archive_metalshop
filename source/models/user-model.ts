
import {EventDetails} from "event-decorators"
import {
	AccessToken,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"

import {
	createEventDispatcher as dispatcher
} from "../toolbox/event-dispatcher.js"

import {
	UserLoginEvent,
	UserErrorEvent,
	UserLogoutEvent,
	UserLoadingEvent,
} from "../events.js"

import {
	UserModel,
	AuthContext,
	LoginPopupRoutine,
	DecodeAccessToken,
} from "../interfaces.js"

const expiryGraceSeconds = 60
const bubbles: CustomEventInit = {bubbles: true, composed: true}

export function createUserModel({
	eventTarget, tokenStorage, loginPopupRoutine, decodeAccessToken
}: {
	eventTarget: EventTarget
	tokenStorage: TokenStorageTopic
	loginPopupRoutine: LoginPopupRoutine
	decodeAccessToken: DecodeAccessToken
}): UserModel {

	//
	// private
	//

	let authContext: AuthContext

	// event dispatcher functions
	const dispatchUserError = dispatcher(UserErrorEvent, eventTarget, bubbles)
	const dispatchUserLogin = dispatcher(UserLoginEvent, eventTarget, bubbles)
	const dispatchUserLogout = dispatcher(UserLogoutEvent, eventTarget, bubbles)
	const dispatchUserLoading = dispatcher(UserLoadingEvent, eventTarget, bubbles)

	/** Receive and decode an access token for login
	 * - return an async getter which seamlessly refreshes expired tokens
	 * - we pass around a getter instead of an auth context, because auth
	 *   context can expire, and so consumers are expected to use this getter
	 *   for each new interacton */
	function processAccessToken(accessToken: AccessToken):
		EventDetails<UserLoginEvent> {

		authContext = decodeAccessToken(accessToken)

		return {
			async getAuthContext() {
				const gracedExp = (authContext.exp - expiryGraceSeconds)
				const expired = gracedExp < (Date.now() / 1000)
				if (expired) {
					const accessToken = await tokenStorage.passiveCheck()
					authContext = decodeAccessToken(accessToken)
				}
				return authContext
			}
		}
	}

	//
	// public
	//

	return {

		/** Initial passive check, to see if we're already logged in */
		async start() {
			dispatchUserLoading()
			try {
				const accessToken = await tokenStorage.passiveCheck()

				if (accessToken) {
					const detail = processAccessToken(accessToken)
					dispatchUserLogin({detail})
				}
				else {
					dispatchUserLogout()
				}
			}
			catch (error) {
				error.message = `user-model error in start(): ${error.message}`
				console.error(error)
				dispatchUserError({detail: {error}})
			}
		},

		/** Trigger a user login routine */
		async login() {
			dispatchUserLoading()
			try {
				const authTokens = await loginPopupRoutine()
				await tokenStorage.writeTokens(authTokens)
				const detail = processAccessToken(authTokens.accessToken)
				dispatchUserLogin({detail})
			}
			catch (error) {
				console.error(error)
				dispatchUserError({detail: {error}})
			}
		},

		/** Trigger a user logout routine */
		async logout() {
			dispatchUserLoading()
			try {
				await tokenStorage.clearTokens()
				authContext = null
				dispatchUserLogout()
			}
			catch (error) {
				console.error(error)
				dispatchUserError({detail: {error}})
			}
		},

		/** Process a new token as a login
		 * - some services might return new tokens from the auth server for you */
		async loginWithAccessToken(accessToken: AccessToken) {
			const detail = processAccessToken(accessToken)
			await tokenStorage.writeAccessToken(accessToken)
			dispatchUserLogin({detail})
		},
	}
}
