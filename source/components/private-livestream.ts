
import {LitElement, html, css, property} from "lit-element"
import {LivestreamMode} from "../models/livestream-model.js"
import {LivestreamState, Livestream} from "../system/interfaces.js"
import { select } from "../toolbox/selects.js";

export class PrivateLivestream extends LitElement {
	@property({type: Object}) livestreamState: LivestreamState
	onUpdateLivestream: (livestream: Livestream) => void = () => {}

	static get styles() {return css`

	`}

	private _renderLoggedOut() {
		return html`
			<slot name="loggedout">
				<h2>Private livestream</h2>
				<p>You must be logged in as a premium supporter to view the
					livestream</p>
			</slot>
		`
	}

	private _renderUnprivileged() {
		return html`
			<slot name="unprivileged">
				<h2>Private livestream</h2>
				<p>Become a premium supporter to view the livestream</p>
			</slot>
		`
	}

	private _renderViewer() {
		const {livestream} = this.livestreamState
		return html`
			<div class="viewer">
				<p>this is the livestream</p>
				${livestream
					? html`<p>livestream: "${this.livestreamState.livestream.embed}"</p>`
					: html`<p>no livestream set :(</p>`}
				
			</div>
		`
	}

	private _renderPrivileged() {
		return html`
			${this._renderViewer()}
		`
	}

	private _handleClickUpdateLivestream = () => {
		const input = select<HTMLInputElement>(
			"input[name=livestream-embed]",
			this.shadowRoot
		)
		const livestream: Livestream = {
			embed: input.value
		}
		this.onUpdateLivestream(livestream)
	}

	private _renderAdmin() {
		return html`
			<div class="adminpanel coolbuttonarea formarea">
				admin controls lul
				<input
					type="text"
					name="livestream-embed"
					placeholder="livestream embed"
					/>
				<button @click=${this._handleClickUpdateLivestream}>
					update livestream
				</button>
			</div>
			${this._renderViewer()}
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
