
import {bubblingEvent, Dispatcher} from "event-decorators"
import {LitElement, property, html, css} from "lit-element"

import {
	UserLoginEvent,
	UserLogoutEvent
} from "../events.js"

import {
	AccessToken,
	AccessPayload,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"
import {bdecode} from "authoritarian/dist/bdecode.js"

import {AccountPopupLogin, AuthContext, GetAuthContext} from "../interfaces.js"

const expiryGracePeriodSeconds = 60

function decodeAccessToken(accessToken: AccessToken): AuthContext {
	const data = bdecode<AccessPayload>(accessToken)
	const {payload, exp} = data
	const {user} = payload
	return {exp, user, accessToken}
}

export class UserPanel extends LitElement {
	@property({type: String}) server: string
	@property({type: Object}) authContext: AuthContext
	@property({type: Object}) tokenStorage: TokenStorageTopic
	@property({type: Function}) getAuthContext: GetAuthContext
	@property({type: Function}) accountPopupLogin: AccountPopupLogin

	@bubblingEvent(UserLoginEvent) dispatchUserLogin: Dispatcher<UserLoginEvent>
	@bubblingEvent(UserLogoutEvent) dispatchUserLogout: Dispatcher<UserLogoutEvent>

	async startup() {
		const accessToken = await this.tokenStorage.passiveCheck()
		if (accessToken) {
			console.log("token storage provides access token")
			this._handleNewAccessToken(accessToken)
		}
		else {
			console.log("token storage has no access token")
		}
	}

	logout = async() => {
		this.tokenStorage.clearTokens()
		this.authContext = null
		this.dispatchUserLogout()
	}

	login = async() => {
		const authTokens = await this.accountPopupLogin(this.server)
		await this.tokenStorage.writeTokens(authTokens)
		this._handleNewAccessToken(authTokens.accessToken)
	}

	private _handleNewAccessToken(accessToken: AccessToken) {
		this.authContext = decodeAccessToken(accessToken)

		const getAuthContext = async() => {
			const expWithoutGrace = (this.authContext.exp - expiryGracePeriodSeconds)
			const expired = expWithoutGrace < (Date.now() / 1000)
			if (expired) {
				const accessToken = await this.tokenStorage.passiveCheck()
				this.authContext = decodeAccessToken(accessToken)
			}
			return this.authContext
		}

		this.dispatchUserLogin({detail: {getAuthContext}})
	}

	static get styles() {
		return css``
	}

	render() {
		return html`
			${!this.authContext
				? html`<button class="login" @click=${this.login}>Login</button>`
				: html``}
			<slot></slot>
			${this.authContext
				? html`<button class="logout" @click=${this.logout}>Logout</button>`
				: html``}
		`
	}
}
