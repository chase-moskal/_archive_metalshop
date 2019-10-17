
import {LitElement, html, css, svg, property} from "lit-element"
import {unsafeHTML} from "lit-html/directives/unsafe-html.js"

import {select} from "../toolbox/selects.js"
import {LivestreamState} from "../system/interfaces.js"
import {LivestreamMode} from "../models/livestream-model.js"

const icons = {
	cancel: svg`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 1.3c1.3 0 2.5.44 3.47 1.17l-8 8A5.755 5.755 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zm0 11.41c-1.3 0-2.5-.44-3.47-1.17l8-8c.73.97 1.17 2.17 1.17 3.47 0 3.14-2.56 5.7-5.7 5.7z"/></svg>`
}

export class PrivateLivestream extends LitElement {
	@property({type: Object}) livestreamState: LivestreamState
	onUpdateLivestream: (vimeostring: string) => void = () => {}

	static get styles() {return css`
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
	`}

	private _renderLoggedOut() {
		return html`
			<slot name="loggedout">
				<h2>Private livestream</h2>
				<p>
					To view the livestream, you must be logged in, and subscribed as a
					premium supporter
				</p>
			</slot>
			<div class="ghostplayer">${icons.cancel}</div>
		`
	}

	private _renderUnprivileged() {
		return html`
			<slot name="unprivileged">
				<h2>Private livestream</h2>
				<p>
					Subscribe as a premium supporter to view the livestream
				</p>
			</slot>
			<div class="ghostplayer">${icons.cancel}</div>
		`
	}

	private _renderViewer() {
		const {livestream} = this.livestreamState
		return html`
			<div class="viewer">
				${livestream
					? unsafeHTML(livestream.embed)
					: html`<p>no livestream set :(</p>`}
			</div>
		`
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
		this.onUpdateLivestream(input.value)
		input.value = ""
	}

	private _renderAdmin() {
		const {livestreamState} = this
		const {errorMessage} = livestreamState
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
				${errorMessage
					? html`<p class="error">${errorMessage}</p>`
					: html``}
			</div>
		`
	}

	render() {
		if (!this.livestreamState) return html``
		switch (this.livestreamState.mode) {
			case LivestreamMode.LoggedOut: return this._renderLoggedOut()
			case LivestreamMode.Unprivileged: return this._renderUnprivileged()
			case LivestreamMode.Privileged: return this._renderPrivileged()
			case LivestreamMode.Admin: return this._renderAdmin()
		}
	}
}
