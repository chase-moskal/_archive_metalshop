
import {LitElement, property, html, css} from "lit-element"
import {bubblingEvent, Dispatcher, listener} from "event-decorators"
import {Profile, ProfilerTopic} from "authoritarian/dist/interfaces.js"

import {AuthContext} from "../interfaces.js"

import {
	ProfileUpdateEvent, UserLoadingEvent,
} from "../events.js"

export class ProfilePanel extends LitElement {
	@property({type: Boolean}) private _loading: boolean = true
	@property({type: Object}) private _profile: Profile

	@listener(UserLoadingEvent, {target: window})
	protected _handleUserLoading = async(event: UserLoadingEvent) => {
		this._profile = null
		this._loading = true
	}

	@listener(ProfileUpdateEvent, {target: window})
	protected _handleProfileUpdate = async(event: ProfileUpdateEvent) => {
		const {profile} = event.detail
		this._profile = profile
		this._loading = false
	}

	static get styles() {
		return css`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			:host {
				display: flex;
				flex-direction: row;
			}
			img {
				flex: 0 0 auto;
				width: 30%;
				min-width: 60px;
				max-width: 140px;
				object-fit: cover;
				border: 5px solid rgba(255,255,255, 0.5);
			}
			div {
				flex: 1 1 auto;
				display: flex;
				padding: 0.5em;
				flex-direction: column;
				justify-content: center;
			}
			div > * + * {
				margin-top: 0.6em;
			}
			h2 {
				font-size: 1.1em;
			}
			@media (max-width: 600px) {
				:host {
					flex-direction: column;
					align-items: flex-start;
				}
				img {
					width: 60%;
					max-width: 240px;
				}
			}
		`
	}

	render() {
		const {_profile} = this
		return html`
			${this._loading
				? html`<div class="loading">loading profile</div>`
				: html``}
			${this._profile
				? html`
					<img src=${_profile.public.picture} alt="[your profile picture]"/>
					<div>
						<h2>${_profile.private.realname}</h2>
						<p>${_profile.public.nickname}</p>
					</div>
				`
				: html``}
		`
	}
}
