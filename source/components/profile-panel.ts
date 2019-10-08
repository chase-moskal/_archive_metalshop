
import {property, html, css} from "lit-element"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"
import {
	Unsubscribe,
	AvatarReader,
	ProfileReader,
} from "../system/interfaces.js"

export class ProfilePanel extends LoadableElement {
	loadingMessage = "loading profile panel"
	errorMessage = "error in profile panel"
	@property({type: Object}) reader: ProfileReader
	@property({type: Object}) avatarReader: AvatarReader

	private _unsubscribers: Unsubscribe[] = []

	connectedCallback() {
		this._unsubscribers = [
			this.avatarReader.subscribe(() => this.requestUpdate()),
			this.reader.subscribe(() => {this.requestUpdate()})
		]
	}

	disconnectedCallback() {
		for (const unsubscribe of this._unsubscribers) unsubscribe()
	}

	updated() {
		const {state} = this.reader
		this.loadableState = state.error
			? LoadableState.Error
			: state.loading
				? LoadableState.Loading
				: LoadableState.Ready
	}

	static get styles() {return [super.styles, css`
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
	`]}

	renderReady() {
		const {profile} = this.reader.state
		const avatarState = this.avatarReader.state
		return profile ? html`
			<div class="container">
				<img src=${profile.public.picture} alt="[your profile picture]"/>
				<avatar-display .state=${avatarState}></avatar-display>
				<div>
					<h2>${profile.private.realname}</h2>
					<p>${profile.public.nickname}</p>
				</div>
			</div>
		` : html``
	}
}
