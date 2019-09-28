
import {LitElement, property, html, css} from "lit-element"
import {bubblingEvent, Dispatcher, listener} from "event-decorators"
import {Profile, ProfilerTopic} from "authoritarian/dist/interfaces.js"

import {AuthContext} from "../interfaces.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	ProfileLoadedEvent,
} from "../events.js"

export class ProfilePanel extends LitElement {
	private _profiler: ProfilerTopic

	@property({type: String}) server: string
	@property({type: Object}) private _profile: Profile
	@bubblingEvent(ProfileLoadedEvent) dispatchProfileLoaded: Dispatcher<ProfileLoadedEvent>

	async start({profiler}: {profiler: ProfilerTopic}) {
		this._profiler = profiler
	}

	@listener(UserLoginEvent, {target: window})
	protected _handleUserLogin = async(event: UserLoginEvent) => {
		const authContext = await event.detail.getAuthContext()
		this._profile = await this._loadProfile(authContext)
	}

	@listener(UserLogoutEvent, {target: window})
	protected _handleUserLogout = (event: UserLogoutEvent) => {
		this._profile = null
	}

	private async _loadProfile(authContext: AuthContext) {
		const {accessToken} = authContext
		const profile = await this._profiler.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		this.dispatchProfileLoaded({detail: {profile}})
		return profile
	}

	static get styles() {
		return css``
	}

	render() {
		const {_profile} = this
		return _profile ? html`
			<img src=${_profile.public.picture} alt="[your profile picture]"/>
			<h2>${_profile.private.realname}</h2>
			<p>Display name: ${_profile.public.nickname}</p>
		` : html``
	}
}
