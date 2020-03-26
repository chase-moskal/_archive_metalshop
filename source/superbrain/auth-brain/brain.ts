
import {AuthMode, expiryGraceSeconds} from "./constants.js"
import {AccessToken} from "authoritarian/dist/interfaces.js"
import {LoginDetail, AuthContext} from "../../interfaces.js"
import {actionelize, observelize} from "../../framework/mobb.js"
import {AuthState, AuthActions, AuthBrainOptions} from "./interfaces.js"

export function makeAuthBrain({
	tokenStorage,
	loginPopupRoutine,
	decodeAccessToken,
}: AuthBrainOptions) {

	let authContext: AuthContext

	// observable mobx state
	const state: AuthState = observelize({
		getAuthContext: null,
		mode: AuthMode.Loading,
	})

	// actions can mutate state
	const actions: AuthActions = actionelize({
		modeError(error: Error) {
			state.mode = AuthMode.Error
			state.getAuthContext = null
			console.error(error)
		},
		modeLoading() {
			state.mode = AuthMode.Loading
			state.getAuthContext = null
		},
		modeLoggedIn({getAuthContext}: LoginDetail) {
			state.mode = AuthMode.LoggedIn
			state.getAuthContext = getAuthContext
		},
		modeLoggedOut() {
			state.mode = AuthMode.LoggedOut
			state.getAuthContext = null
		},
	})

	/** Receive and decode an access token for login
	 * - return an async getter which seamlessly refreshes expired tokens
	 * - we pass around a getter instead of an auth context, because auth
	 *   context can expire, and so consumers are expected to use this getter
	 *   for each new interacton */
	function processAccessToken(accessToken: AccessToken): LoginDetail {
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

	const wiring = {

		/** Initial passive check, to see if we're already logged in */
		async start() {
			actions.modeLoading()
			try {
				const accessToken = await tokenStorage.passiveCheck()
				if (accessToken) {
					actions.modeLoggedIn(processAccessToken(accessToken))
				}
				else {
					actions.modeLoggedOut()
				}
			}
			catch (error) {
				console.error("user-model error in start()")
				actions.modeError(error)
			}
		},

		/** Process a new token as a login
		 * - some services might return new tokens from the auth server for you */
		async receiveLoginWithAccessToken(accessToken: AccessToken) {
			const detail = processAccessToken(accessToken)
			await tokenStorage.writeAccessToken(accessToken)
			actions.modeLoggedIn(detail)
		},

		/** Trigger a user login routine */
		async login() {
			actions.modeLoggedOut()
			try {
				const authTokens = await loginPopupRoutine()
				await tokenStorage.writeTokens(authTokens)
				actions.modeLoggedIn(processAccessToken(authTokens.accessToken))
			}
			catch (error) {
				console.error(error)
				actions.modeError(error)
			}
		},

		/** Trigger a user logout routine */
		async logout() {
			actions.modeLoading()
			try {
				await tokenStorage.clearTokens()
				authContext = null
				actions.modeLoggedOut()
			}
			catch (error) {
				console.error(error)
				actions.modeError(error)
			}
		},
	}

	// return the brain!
	return {state, actions, wiring}
}
