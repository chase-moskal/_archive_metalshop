
import {bubblingEvent, Dispatcher} from "event-decorators"
import {LitElement, property, html, css} from "lit-element"

import {
	AccessToken,
	AccessPayload,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"
import {bdecode} from "authoritarian/dist/bdecode.js"
import {createTokenStorageCrosscallClient} from "authoritarian/dist/clients.js"

import {
	UserLoginEvent,
	UserLogoutEvent
} from "../events.js"

import {
	AuthContext,
	GetAuthContext,
	AccountPopupLogin,
	DecodeAccessToken,
} from "../interfaces.js"

const expiryGraceSeconds = 60

export class UserPanel extends LitElement {
	getAuthContext: GetAuthContext
	private _tokenStorage: TokenStorageTopic
	private _accountPopupLogin: AccountPopupLogin
	private _decodeAccessToken: DecodeAccessToken

	@property({type: String})
		server: string

	@property({type: Object})
		private _authContext: AuthContext

	@bubblingEvent(UserLoginEvent)
		dispatchUserLogin: Dispatcher<UserLoginEvent>

	@bubblingEvent(UserLogoutEvent)
		dispatchUserLogout: Dispatcher<UserLogoutEvent>

	configure({server, tokenStorage, accountPopupLogin, decodeAccessToken}: {
		server?: string
		tokenStorage?: TokenStorageTopic
		accountPopupLogin?: AccountPopupLogin
		decodeAccessToken?: DecodeAccessToken
	} = {}) {
		this.server = server
		this._tokenStorage = tokenStorage
		this._accountPopupLogin = accountPopupLogin
		this._decodeAccessToken = decodeAccessToken
	}

	async firstUpdated() {
		this._decodeAccessToken = this._decodeAccessToken ||
			(accessToken => {
				const data = bdecode<AccessPayload>(accessToken)
				const {payload, exp} = data
				const {user} = payload
				return {exp, user, accessToken}
			})
		this._tokenStorage = this._tokenStorage || await createTokenStorageCrosscallClient({
			url: `${this.server}/html/token-storage`
		})

		const accessToken = await this._tokenStorage.passiveCheck()

		if (accessToken) {
			console.log("token storage provides access token")
			this._receiveAccessToken(accessToken)
		}
		else {
			console.log("no access token from token storage")
		}
	}

	/**
	 * Perform a login
	 */
	login = async() => {
		const authTokens = await this._accountPopupLogin(this.server)
		await this._tokenStorage.writeTokens(authTokens)
		this._receiveAccessToken(authTokens.accessToken)
	}

	/**
	 * Perform a logout
	 */
	logout = async() => {
		this._tokenStorage.clearTokens()
		this._authContext = null
		this.dispatchUserLogout()
	}

	private _receiveAccessToken(accessToken: AccessToken) {
		this._authContext = this._decodeAccessToken(accessToken)

		const getAuthContext = async() => {
			const gracedExp = (this._authContext.exp - expiryGraceSeconds)
			const expired = gracedExp < (Date.now() / 1000)
			if (expired) {
				const accessToken = await this._tokenStorage.passiveCheck()
				this._authContext = this._decodeAccessToken(accessToken)
			}
			return this._authContext
		}

		this.dispatchUserLogin({detail: {getAuthContext}})
	}

	static get styles() {
		return css``
	}

	render() {
		return html`
			${!this._authContext
				? html`<button class="login" @click=${this.login}>Login</button>`
				: html``}
			<slot></slot>
			${this._authContext
				? html`<button class="logout" @click=${this.logout}>Logout</button>`
				: html``}
		`
	}
}
