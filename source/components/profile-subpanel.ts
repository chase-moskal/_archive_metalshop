
import {bubblingEvent, Dispatcher, listener} from "event-decorators"
import {Profile, ProfilerTopic} from "authoritarian/dist/interfaces.js"
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {AuthContext} from "../interfaces.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	ProfileLoadedEvent,
} from "../events.js"

export class ProfileSubpanel extends LitElement {
	@property({type: Object}) profile: Profile
	@property({type: Object}) profiler: ProfilerTopic
	@property({type: Object}) authContext: AuthContext

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
			this.profile = await this.profiler.getProfile({accessToken})
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
