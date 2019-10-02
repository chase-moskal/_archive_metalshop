
import {listener} from "event-decorators"
import {property, html, css} from "lit-element"
import {Profile} from "authoritarian/dist/interfaces.js"

import {ProfileUpdateEvent, UserLoadingEvent} from "../events.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

export class ProfilePanel extends LoadableElement {
	loadingMessage = "loading profile"
	@property({type: Object}) private _profile: Profile

	@listener(UserLoadingEvent, {target: window})
	protected _handleUserLoading = async(event: UserLoadingEvent) => {
		this._profile = null
		this.loadableState = LoadableState.Loading
	}

	@listener(ProfileUpdateEvent, {target: window})
	protected _handleProfileUpdate = async(event: ProfileUpdateEvent) => {
		const {profile} = event.detail
		this._profile = profile
		this.loadableState = LoadableState.Ready
	}

	static get styles() {
		return [super.styles, css`
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
		`]
	}

	renderReady() {
		const {_profile: profile} = this
		return profile ? html`
			<img src=${profile.public.picture} alt="[your profile picture]"/>
			<div>
				<h2>${profile.private.realname}</h2>
				<p>${profile.public.nickname}</p>
			</div>
		` : html``
	}
}
