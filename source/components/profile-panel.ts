
import {LitElement, property, html, css} from "lit-element"
import {bubblingEvent, Dispatcher, listener} from "event-decorators"
import {Profile, ProfilerTopic} from "authoritarian/dist/interfaces.js"

import {AuthContext} from "../interfaces.js"

import {
	ProfileUpdateEvent,
} from "../events.js"

export class ProfilePanel extends LitElement {
	@property({type: Object}) private _profile: Profile

	@listener(ProfileUpdateEvent, {target: window})
	protected _handleProfileUpdate = async(event: ProfileUpdateEvent) => {
		const {profile} = event.detail
		this._profile = profile
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
