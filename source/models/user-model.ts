
import {Dispatcher, EventDetails} from "event-decorators"
import {
	AccessToken,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"

import {createEventDispatcher} from "../toolbox/create-event-dispatcher.js"

import {
	UserLoginEvent,
	UserErrorEvent,
	UserLogoutEvent,
	UserLoadingEvent,
} from "../events.js"

import {
	AuthContext,
	GetAuthContext,
	AccountPopupLogin,
	DecodeAccessToken,
} from "../interfaces.js"

const expiryGraceSeconds = 60
const bubbles: CustomEventInit = {bubbles: true, composed: true}

function dispatcher<E extends CustomEvent>(
	E: {new(...args:any): E},
	target: EventTarget
) {
	return createEventDispatcher<E>(
		E, target, {bubbles: true, composed: true}
	)
}

export class UserModel {
	private _authServerUrl: string
	private _dispatchUserError: Dispatcher<UserErrorEvent>
	private _dispatchUserLogin: Dispatcher<UserLoginEvent>
	private _dispatchUserLogout: Dispatcher<UserLogoutEvent>
	private _dispatchUserLoading: Dispatcher<UserLoadingEvent>

	private _authContext: AuthContext
	private _tokenStorage: TokenStorageTopic
	private _accountPopupLogin: AccountPopupLogin
	private _decodeAccessToken: DecodeAccessToken

	constructor({
		authServerUrl, eventTarget, tokenStorage, accountPopupLogin,
		decodeAccessToken
	}: {
		authServerUrl: string
		eventTarget: EventTarget
		tokenStorage: TokenStorageTopic
		accountPopupLogin: AccountPopupLogin
		decodeAccessToken: DecodeAccessToken
	}) {
		this._authServerUrl = authServerUrl
		this._dispatchUserError = dispatcher(UserErrorEvent, eventTarget)
		this._dispatchUserLogin = dispatcher(UserLoginEvent, eventTarget)
		this._dispatchUserLogout = dispatcher(UserLogoutEvent, eventTarget)
		this._dispatchUserLoading = dispatcher(UserLoadingEvent, eventTarget)
		this._tokenStorage = tokenStorage
		this._accountPopupLogin = accountPopupLogin
		this._decodeAccessToken = decodeAccessToken
	}

	async start() {
		this._dispatchUserLoading()
		try {
			const accessToken = await this._tokenStorage.passiveCheck()
			if (accessToken) {
				const detail = this._receiveAccessToken(accessToken)
				this._dispatchUserLogin({detail})
			}
			else {
				this._dispatchUserLogout()
			}
		}
		catch (error) {
			error.message = `user-model error in start(): ${error.message}`
			console.error(error)
			this._dispatchUserError({detail: {error}})
		}
	}

	login = async() => {
		this._dispatchUserLoading()
		try {
			const authTokens = await this._accountPopupLogin(this._authServerUrl)
			await this._tokenStorage.writeTokens(authTokens)
			const detail = this._receiveAccessToken(authTokens.accessToken)
			this._dispatchUserLogin({detail})
		}
		catch (error) {
			console.error(error)
			this._dispatchUserError({detail: {error}})
		}
	}

	logout = async() => {
		this._dispatchUserLoading()
		try {
			await this._tokenStorage.clearTokens()
			this._authContext = null
			this._dispatchUserLogout()
		}
		catch (error) {
			console.error(error)
			this._dispatchUserError({detail: {error}})
		}
	}

	handleNewAccessToken = async(accessToken: AccessToken) => {
		const detail = this._receiveAccessToken(accessToken)
		await this._tokenStorage.writeAccessToken(accessToken)
		this._dispatchUserLogin({detail})
	}

	private _receiveAccessToken(
		accessToken: AccessToken
	): EventDetails<UserLoginEvent> {
		this._authContext = this._decodeAccessToken(accessToken)
		const getAuthContext: GetAuthContext = async() => {
			const gracedExp = (this._authContext.exp - expiryGraceSeconds)
			const expired = gracedExp < (Date.now() / 1000)
			if (expired) {
				const accessToken = await this._tokenStorage.passiveCheck()
				this._authContext = this._decodeAccessToken(accessToken)
			}
			return this._authContext
		}
		return {getAuthContext}
	}
}
