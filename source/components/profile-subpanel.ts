
import {bubblingEvent, Dispatcher, listener} from "event-decorators"
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {
	Profile,
	AuthContext,
	ProfileManagerTopic,
} from "../interfaces.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	ProfileLoadedEvent,
} from "../events.js"

export class ProfileSubpanel extends LitElement {
	@property({type: Object}) profileManager: ProfileManagerTopic = null
	@property({type: Object}) profile: Profile = null
	@property({type: Object}) authContext: AuthContext = null

	@bubblingEvent(ProfileLoadedEvent) dispatchProfileLoaded: Dispatcher<ProfileLoadedEvent>

	@listener(UserLoginEvent, {target: window})
	protected _handleUserLogin = (event: UserLoginEvent) => {
		this.authContext = event.detail
	}

	@listener(UserLogoutEvent, {target: window})
	protected _handleUserLogout = (event: UserLogoutEvent) => {
		this.authContext = null
	}

	private async _loadProfile() {
		if (this.authContext) {
			const {accessToken} = this.authContext
			this.profile = await this.profileManager.getProfile({accessToken})
			this.dispatchProfileLoaded({detail: this.profile})
		}
		else {
			this.profile = null
		}
	}

	protected updated(changedProperties: PropertyValues) {
		if (changedProperties.has("authContext")) {
			this._loadProfile()
		}
	}

	static get styles() {
		return css``
	}

	render() {
		const {profile} = this
		return profile ? html`
			<img src=${profile.picture} alt="[your profile picture]"/>
			<h2>${profile.realname}</h2>
			<p>Display name: ${profile.nickname}</p>
		` : html``
	}
}
