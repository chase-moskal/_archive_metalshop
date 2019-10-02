
import {Dispatcher, EventDetails} from "event-decorators"
import {
	AccessToken,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"

import {createEventDispatcher} from "../toolbox/create-event-dispatcher.js"

import {
	UserLoginEvent,
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
		this._dispatchUserLogin = dispatcher(UserLoginEvent, eventTarget)
		this._dispatchUserLogout = dispatcher(UserLogoutEvent, eventTarget)
		this._dispatchUserLoading = dispatcher(UserLoadingEvent, eventTarget)
		this._tokenStorage = tokenStorage
		this._accountPopupLogin = accountPopupLogin
		this._decodeAccessToken = decodeAccessToken
	}

	async start() {
		this._dispatchUserLoading()
		let detail: EventDetails<UserLoginEvent>

		try {
			const accessToken = await this._tokenStorage.passiveCheck()
			if (accessToken) {
				detail = this._receiveAccessToken(accessToken)
			}
		}
		catch (error) {
			error.message = `user-model error in start(): ${error.message}`
			console.error(error)
		}

		if (detail)
			this._dispatchUserLogin({detail})
		else
			this._dispatchUserLogout()
	}

	login = async() => {
		this._dispatchUserLoading()
		let detail: EventDetails<UserLoginEvent>

		try {
			const authTokens = await this._accountPopupLogin(this._authServerUrl)
			await this._tokenStorage.writeTokens(authTokens)
			detail = this._receiveAccessToken(authTokens.accessToken)
		}
		catch (error) {
			error.message = `user-model error in login(): ${error.message}`
			console.error(error)
		}

		if (detail)
			this._dispatchUserLogin({detail})
		else
			this._dispatchUserLogout()
	}

	logout = async() => {
		this._dispatchUserLoading()
		try {
			await this._tokenStorage.clearTokens()
		}
		catch (error) {
			console.error(error)
		}
		this._authContext = null
		this._dispatchUserLogout()
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