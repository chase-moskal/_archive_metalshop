
import {bubblingEvent, Dispatcher, listener} from "event-decorators"
import {LitElement, property, html, css} from "lit-element"

import {Profile, ProfilerTopic} from "authoritarian/dist/interfaces.js"
import {createProfilerCacheCrosscallClient} from "authoritarian/dist/clients.js"

import {AuthContext} from "../interfaces.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	ProfileLoadedEvent,
} from "../events.js"

export class ProfileSubpanel extends LitElement {
	@property({type: Object}) profile: Profile
	private _profiler: ProfilerTopic

	@bubblingEvent(ProfileLoadedEvent) dispatchProfileLoaded: Dispatcher<ProfileLoadedEvent>

	configure({profiler}: {
		profiler?: ProfilerTopic
	} = {}) {
		this._profiler = profiler
	}

	async firstUpdated() {
		this._profiler = this._profiler || await createProfilerCacheCrosscallClient({
			url: "http://localhost:8001/html/profiler-cache"
		})
	}

	@listener(UserLoginEvent, {target: window})
	protected _handleUserLogin = async(event: UserLoginEvent) => {
		const authContext = await event.detail.getAuthContext()
		this.profile = await this._loadProfile(authContext)
	}

	@listener(UserLogoutEvent, {target: window})
	protected _handleUserLogout = (event: UserLogoutEvent) => {
		this.profile = null
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
		const {profile} = this
		return profile ? html`
			<img src=${profile.public.picture} alt="[your profile picture]"/>
			<h2>${profile.private.realname}</h2>
			<p>Display name: ${profile.public.nickname}</p>
		` : html``
	}
}
