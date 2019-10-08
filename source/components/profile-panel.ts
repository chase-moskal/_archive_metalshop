
import {listener} from "event-decorators"
import {property, html, css} from "lit-element"
import {Profile} from "authoritarian/dist/interfaces.js"

import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"
import {
	UserLoadingEvent,
	ProfileErrorEvent,
	ProfileUpdateEvent,
} from "../system/events.js"
import {AvatarReader} from "../system/interfaces.js"

export class ProfilePanel extends LoadableElement {
	loadingMessage = "loading profile panel"
	@property({type: Object}) avatarReader: AvatarReader
	@property({type: Object}) private _profile: Profile

	private _handleAvatarUpdate = () => this.requestUpdate()
	connectedCallback() {
		this.avatarReader.subscribe(this._handleAvatarUpdate)
	}
	disconnectedCallback() {
		this.avatarReader.unsubscribe(this._handleAvatarUpdate)
	}

	@listener(ProfileErrorEvent, {target: window})
	protected _handleProfileError = async(event: UserLoadingEvent) => {
		this._profile = null
		this.loadableState = LoadableState.Error
	}

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
			.container {
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
			.container > div {
				flex: 1 1 auto;
				display: flex;
				padding: 0.5em;
				flex-direction: column;
				justify-content: center;
			}
			.container > div > * + * {
				margin-top: 0.6em;
			}
			h2 {
				font-size: 1.1em;
			}
			@media (max-width: 600px) {
				.container {
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
		const avatarState = this.avatarReader.state
		return profile ? html`
			<div class="container">
				<img src=${profile.public.picture} alt="[your profile picture]"/>
				<avatar-display
					.url=${avatarState.url}
					.premium=${avatarState.premium}>
				</avatar-display>
				<div>
					<h2>${profile.private.realname}</h2>
					<p>${profile.public.nickname}</p>
				</div>
			</div>
		` : html``
	}
}
