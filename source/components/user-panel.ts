
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {mockDecodeToken as decodeToken} from "../mocks.js"
import {UserLoginEvent} from "../events/user-login-event.js"
import {UserLogoutEvent} from "../events/user-logout-event.js"

import {
	AccessToken,
	AccountPopupTopic,
	TokenStorageTopic,
	// decodeToken,
} from "authoritarian"

import {
	AuthContext,
	UserSubpanel
} from "../interfaces.js"

export class UserPanel extends LitElement {
	@property({type: Object}) authContext: AuthContext = null
	@property({type: Object}) accountPopup: AccountPopupTopic = null
	@property({type: Object}) tokenStorage: TokenStorageTopic = null

	private _subpanels: UserSubpanel[] = []

	async startup() {
		const accessToken = await this.tokenStorage.passiveCheck()
		this._decodeAuthContext(accessToken)
	}

	logout = async() => {
		this.tokenStorage.clearTokens()
		this.authContext = null
		this.dispatchEvent(new UserLogoutEvent())
	}

	login = async() => {
		const authTokens = await this.accountPopup.login()
		await this.tokenStorage.writeTokens(authTokens)
		this._decodeAuthContext(authTokens.accessToken)
	}

	firstUpdated() {
		const slot: HTMLSlotElement = this.shadowRoot.querySelector("slot")
		this._subpanels = <any>Array.from(slot.assignedElements())
	}

	updated(changedProperties: PropertyValues) {
		if (changedProperties.has("authContext")) {
			this._updateSubpanels()
		}
	}

	private _updateSubpanels() {
		for (const subpanel of this._subpanels) {
			subpanel.authContext = this.authContext
		}
	}

	private _decodeAuthContext(accessToken: AccessToken) {
		const authContext = this.authContext = {
			accessToken,
			user: decodeToken({token: accessToken})
		}
		this.dispatchEvent(new UserLoginEvent(authContext))
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
