
import {LitElement, property, html, css} from "lit-element"

import {
	User,
	AuthTokens,
	AccessToken,
	decodeToken,
	RefreshToken,
	AccountPopupTopic,
	TokenStorageTopic,
} from "authoritarian"

import {
	UserProfile,
	ProfileManagerTopic,
	PaywallGuardianTopic,
} from "../interfaces.js"

import {UserLoginEvent} from "../events/user-login-event.js"
import {UserLogoutEvent} from "../events/user-logout-event.js"

export class UserPanel extends LitElement {
	@property({type: Object}) accountPopup: AccountPopupTopic = null
	@property({type: Object}) tokenStorage: TokenStorageTopic = null
	@property({type: Object}) profileManager: ProfileManagerTopic = null
	@property({type: Object}) paywallGuardian: PaywallGuardianTopic = null

	@property({type: Object}) accessToken: AccessToken = null
	@property({type: Object}) profile: UserProfile = null

	get user() {
		return this.accessToken
			? decodeToken({token: this.accessToken})
			: null
	}

	get loggedIn() {
		return !!this.profile
	}

	async startup() {
		this.accessToken = await this.tokenStorage.passiveCheck()
		if (this.loggedIn) await this._handleAuthorization()
	}

	private async _handleAuthorization() {
		const {accessToken, user} = this
		const profile = await this.profileManager.getProfile({accessToken})
		this.profile = profile
		this.dispatchEvent(new UserLoginEvent({user, profile, accessToken}))
	}

	private _handleLogoutClick = async() => {
		this.tokenStorage.clearTokens()
		this.accessToken = null
		this.profile = null
		this.dispatchEvent(new UserLogoutEvent())
	}

	private _handleLoginClick = async() => {
		const authTokens = await this.accountPopup.login()
		await this.tokenStorage.writeTokens(authTokens)
		this.accessToken = authTokens.accessToken
		await this._handleAuthorization()
	}

	static get styles() {
		return css``
	}

	private _renderPanelLoggedIn() {
		const {profile} = this
		return html`
			<img src=${profile.picture} alt="[profile picture]"/>
			<h2>${profile.realname}</h2>
			<p>Display name: "${profile.nickname}"</p>
			<button class="logout" @click=${this._handleLogoutClick}>Logout</button>
		`
	}

	private _renderPanelLoggedOut() {
		return html`
			<button class="login" @click=${this._handleLoginClick}>Login</button>
		`
	}

	render() {
		return this.loggedIn
			? this._renderPanelLoggedIn()
			: this._renderPanelLoggedOut()
	}
}
