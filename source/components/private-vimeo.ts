
import {property, html, css, svg} from "lit-element"

import {select} from "../toolbox/selects.js"
import {VimeoState} from "../interfaces.js"
import {PrivilegeMode} from "../models/private-vimeo-model.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

const icons = {
	cancel: svg`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 1.3c1.3 0 2.5.44 3.47 1.17l-8 8A5.755 5.755 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zm0 11.41c-1.3 0-2.5-.44-3.47-1.17l8-8c.73.97 1.17 2.17 1.17 3.47 0 3.14-2.56 5.7-5.7 5.7z"/></svg>`
}

export class PrivateVimeo extends LoadableElement {
	@property({type: Object}) vimeoState: VimeoState
	onUpdateVideo: (vimeostring: string) => void = () => {}

	updated() {
		const {errorMessage = null, loading = true} = this.vimeoState || {}
		this.errorMessage = errorMessage
		this.loadableState = errorMessage
			? LoadableState.Error
			: loading
				? LoadableState.Loading
				: LoadableState.Ready
	}

	static get styles() {return [super.styles, css`
		:host, :host > * {
			display: block;
		}
		:host([hidden]) {
			display: none;
		}
		* + .ghostplayer,
		* + .viewer,
		* + .adminpanel {
			margin-top: 1em;
		}
		.ghostplayer {
			position: relative;
			display: block;
			width: 100%;
			background: rgba(0,0,0, 0.2);
			border: 0.2em solid rgba(0,0,0, 0.1);
		}
		.ghostplayer::before {
			content: "";
			display: block;
			padding-top: 56.25%;
		}
		.ghostplayer svg {
			position: absolute;
			opacity: 0.5;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			width: 30%;
			height: 30%;
			max-width: 10em;
			fill: currentColor;
		}
		.ghostplayer p {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.missing {
			opacity: 0.8;
			font-style: italic;
		}
		.viewer {
			position: relative;
		}
		.viewer::before {
			content: "";
			display: block;
			padding-top: 56.25%;
		}
		.viewer iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.adminpanel {
			padding: 0.5em;
			max-width: 640px;
			margin-left: auto;
			margin-right: auto;
			text-align: center;
			border: 1px solid;
			border-radius: 3px;
		}
		.adminpanel p,
		.adminpanel h3 {
			margin: 0.1em 0.5em;
		}
		.adminpanel h3 {
			text-transform: uppercase;
		}
		.adminpanel .inputarea {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.adminpanel .inputarea > * {
			flex: 1 1 auto;
			margin: 0.5em;
			max-width: 100%;
		}
		.adminpanel .inputarea > button {
			flex: 0 1 auto;
			margin-left: auto;
		}
		.error {
			color: red;
			border: 1px solid;
			border-radius: 3px;
		}
	`]}

	private _renderLoggedOut() {
		return html`
			<slot name="loggedout">
				<h2>Private video</h2>
				<p>
					You must be logged in to view this video
				</p>
			</slot>
			<div class="ghostplayer">${icons.cancel}</div>
		`
	}

	private _renderUnprivileged() {
		return html`
			<slot name="unprivileged">
				<h2>Private video</h2>
				<p>
					Your account does not have privilege to watch this video
				</p>
			</slot>
			<div class="ghostplayer">${icons.cancel}</div>
		`
	}

	private _renderViewer() {
		const {vimeoId} = this.vimeoState
		const query = "?color=00a651&title=0&byline=0&portrait=0&badge=0"
		const viewer = html`
			<div class="viewer">
				<iframe
					frameborder="0"
					allowfullscreen
					allow="autoplay; fullscreen"
					src="https://player.vimeo.com/video/${vimeoId}${query}"
					>
				</iframe>
			</div>
		`
		const nothing = html`
			<div class="missing ghostplayer">
				<p>video missing</p>
			</div>
		`
		return vimeoId ? viewer : nothing
	}

	private _renderPrivileged() {
		return html`
			<slot></slot>
			${this._renderViewer()}
		`
	}

	private _handleClickUpdateLivestream = () => {
		const input = select<HTMLInputElement>(
			"input[name=vimeostring]",
			this.shadowRoot
		)
		this.onUpdateVideo(input.value)
		input.value = ""
	}

	private _renderAdmin() {
		const {vimeoState: livestreamState} = this
		const {validationMessage} = livestreamState
		return html`
			<slot></slot>
			${this._renderViewer()}
			<div class="adminpanel coolbuttonarea formarea">
				<h3>Admin Controls</h3>
				<div class="inputarea">
					<input
						type="text"
						name="vimeostring"
						placeholder="vimeo link or id"
						/>
					<button @click=${this._handleClickUpdateLivestream}>
						update
					</button>
				</div>
				${validationMessage
					? html`<p class="error">${validationMessage}</p>`
					: html``}
			</div>
		`
	}

	renderReady() {
		if (!this.vimeoState) return html``
		switch (this.vimeoState.mode) {
			case PrivilegeMode.LoggedOut: return this._renderLoggedOut()
			case PrivilegeMode.Unprivileged: return this._renderUnprivileged()
			case PrivilegeMode.Privileged: return this._renderPrivileged()
			case PrivilegeMode.Admin: return this._renderAdmin()
		}
	}
}
