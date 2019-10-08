
import {
	AccessToken,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"

import {
	UserModel,
	UserEvents,
	LoginDetail,
	AuthContext,
	LoginPopupRoutine,
	DecodeAccessToken,
} from "../system/interfaces.js"

import {pubsub, pubsubs} from "../toolbox/pubsub.js"

const expiryGraceSeconds = 60

export function createUserModel({
	tokenStorage,
	loginPopupRoutine,
	decodeAccessToken,
}: {
	tokenStorage: TokenStorageTopic
	loginPopupRoutine: LoginPopupRoutine
	decodeAccessToken: DecodeAccessToken
}): UserModel {

	let authContext: AuthContext

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

	const {pub, sub} = pubsubs<UserEvents>({
		userLogout: pubsub<() => void>(),
		userLoading: pubsub<() => void>(),
		userError: pubsub<(error: Error) => void>(),
		userLogin: pubsub<(auth: LoginDetail) => void>(),
	})

	return {
		events: sub,
		actions: {

			/** Initial passive check, to see if we're already logged in */
			async start() {
				pub.userLoading()
				try {
					const accessToken = await tokenStorage.passiveCheck()

					if (accessToken) {
						pub.userLogin(processAccessToken(accessToken))
					}
					else {
						pub.userLogout()
					}
				}
				catch (error) {
					error.message = `user-model error in start(): ${error.message}`
					console.error(error)
					pub.userError(error)
				}
			},

			/** Trigger a user login routine */
			async login() {
				pub.userLoading()
				try {
					const authTokens = await loginPopupRoutine()
					await tokenStorage.writeTokens(authTokens)
					pub.userLogin(processAccessToken(authTokens.accessToken))
				}
				catch (error) {
					console.error(error)
					pub.userError(error)
				}
			},

			/** Trigger a user logout routine */
			async logout() {
				pub.userLoading()
				try {
					await tokenStorage.clearTokens()
					authContext = null
					pub.userLogout()
				}
				catch (error) {
					console.error(error)
					pub.userError(error)
				}
			},

			/** Process a new token as a login
			 * - some services might return new tokens from the auth server for you */
			async loginWithAccessToken(accessToken: AccessToken) {
				const detail = processAccessToken(accessToken)
				await tokenStorage.writeAccessToken(accessToken)
				pub.userLogin(detail)
			}
		}
	}
}
