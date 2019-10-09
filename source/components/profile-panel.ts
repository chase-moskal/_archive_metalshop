
import {property, html, css} from "lit-element"
import {ProfileState, AvatarState} from "../system/interfaces.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

export class ProfilePanel extends LoadableElement {
	@property({type: Object}) avatarState: AvatarState
	@property({type: Object}) profileState: ProfileState
	errorMessage = "error in profile panel"
	loadingMessage = "loading profile panel"

	updated() {
		if (this.profileState) {
			const {error, loading} = this.profileState
			this.loadableState = error
				? LoadableState.Error
				: loading
					? LoadableState.Loading
					: LoadableState.Ready
		}
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
		avatar-display {
			flex: 0 0 auto;
			--avatar-display-size: 6em;
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
		}
	`]}

	renderReady() {
		if (!this.avatarState || !this.profileState) return
		const {avatarState} = this
		const {profile} = this.profileState
		return profile ? html`
			<div class="container">
				<avatar-display .avatarState=${avatarState}></avatar-display>
				<div>
					<h2>${profile.private.realname}</h2>
					<p>${profile.public.nickname}</p>
				</div>
			</div>
		` : html``
	}
}
