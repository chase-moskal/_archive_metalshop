
import {
	AccessToken,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"
import {makeReader} from "../toolbox/pubsub.js"
import {
	UserModel,
	UserState,
	LoginDetail,
	AuthContext,
	LoginPopupRoutine,
	DecodeAccessToken,
} from "../interfaces.js"

const expiryGraceSeconds = 60

export enum UserMode {
	Error,
	Loading,
	LoggedIn,
	LoggedOut,
}

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

	const state: UserState = {
		getAuthContext: null,
		mode: UserMode.Loading,
	}

	const {reader, update} = makeReader<UserState>(state)

	const userLoading = () => {
		state.mode = UserMode.Loading
		state.getAuthContext = null
		update()
	}

	const userLogin = ({getAuthContext}: LoginDetail) => {
		state.mode = UserMode.LoggedIn
		state.getAuthContext = getAuthContext
		update()
	}

	const userError = (error: Error) => {
		state.mode = UserMode.Error
		state.getAuthContext = null
		console.error(error)
		update()
	}

	const userLogout = () => {
		state.mode = UserMode.LoggedOut
		state.getAuthContext = null
		update()
	}

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

	return {
		reader,

		/** Initial passive check, to see if we're already logged in */
		async start() {
			update()
			userLoading()
			try {
				const accessToken = await tokenStorage.passiveCheck()

				if (accessToken) {
					userLogin(processAccessToken(accessToken))
				}
				else {
					userLogout()
				}
			}
			catch (error) {
				error.message = `user-model error in start(): ${error.message}`
				console.error(error)
				userError(error)
			}
		},

		/** Process a new token as a login
		 * - some services might return new tokens from the auth server for you */
		async receiveLoginWithAccessToken(accessToken: AccessToken) {
			const detail = processAccessToken(accessToken)
			await tokenStorage.writeAccessToken(accessToken)
			userLogin(detail)
		},

		/** Trigger a user login routine */
		async login() {
			userLoading()
			try {
				const authTokens = await loginPopupRoutine()
				await tokenStorage.writeTokens(authTokens)
				userLogin(processAccessToken(authTokens.accessToken))
			}
			catch (error) {
				console.error(error)
				userError(error)
			}
		},

		/** Trigger a user logout routine */
		async logout() {
			userLoading()
			try {
				await tokenStorage.clearTokens()
				authContext = null
				userLogout()
			}
			catch (error) {
				console.error(error)
				userError(error)
			}
		},
	}
}
