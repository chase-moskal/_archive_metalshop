
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

import {AuthContext, AccountPopupLogin} from "../interfaces.js"

export class UserPanel extends LitElement {
	@property({type: String}) server: string
	@property({type: Object}) authContext: AuthContext
	@property({type: Object}) tokenStorage: TokenStorageTopic
	@property({type: Function}) accountPopupLogin: AccountPopupLogin

	@bubblingEvent(UserLoginEvent) dispatchUserLogin: Dispatcher<UserLoginEvent>
	@bubblingEvent(UserLogoutEvent) dispatchUserLogout: Dispatcher<UserLogoutEvent>

	async startup() {
		const accessToken = await this.tokenStorage.passiveCheck()
		if (accessToken) {
			console.log("token storage provides access token")
			this._decodeAuthContext(accessToken)
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
		this._decodeAuthContext(authTokens.accessToken)
	}

	private _decodeAuthContext(accessToken: AccessToken) {
		const authContext = this.authContext = {
			accessToken,
			user: bdecode<AccessPayload>(accessToken).payload.user
		}
		this.dispatchUserLogin({detail: authContext})
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
