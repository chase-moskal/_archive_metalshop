
import {LitElement, html, css, svg, property} from "lit-element"
import {PrivateVimeoGovernorTopic,} from "authoritarian/dist/interfaces.js"

import {cancel} from "../system/icons.js"
import {select} from "../toolbox/selects.js"
import {PrivilegeMode} from "../models/private-vimeo-model.js"
import {createPrivateVimeoModel} from "../models/private-vimeo-model.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"

import {VimeoModel, UserModel} from "../interfaces.js"

export class PrivateVimeo extends
	mixinLoadable(
		LitElement
	)
{
	static userModel: UserModel
	static vimeoGovernor: PrivateVimeoGovernorTopic
	
	private _model: VimeoModel
	private _vimeoGovernor: PrivateVimeoGovernorTopic =
		(<any>this.constructor).vimeoGovernor
	private _userModel: UserModel =
		(<any>this.constructor).user

	@property({type: String, reflect: true}) ["video-name"]: string
	onUpdateVideo = (vimeostring: string) => {
		this._model.updateVideo(vimeostring)
	}

	firstUpdated() {
		const {["video-name"]: videoName} = this
		this._model = createPrivateVimeoModel({
			videoName,
			privateVimeoGovernor: this._vimeoGovernor
		})

		const {_userModel: user, _model: model} = this
		const handleUserUpdate = () => {
			const {state: userState} = this._userModel.reader
			model.receiveUserUpdate(userState)
			this.requestUpdate()
		}
		user.reader.subscribe(handleUserUpdate)
		model.reader.subscribe(() => this.requestUpdate())
		handleUserUpdate()
	}

	updated() {
		const {errorMessage = null, loading = true} = this._model.reader.state
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
			<div class="ghostplayer">${cancel}</div>
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
			<div class="ghostplayer">${cancel}</div>
		`
	}

	private _renderViewer() {
		const {vimeoId} = this._model.reader.state
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
		const {validationMessage} = this._model.reader.state
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
		const {mode} = this._model.reader.state
		switch (mode) {
			case PrivilegeMode.LoggedOut: return this._renderLoggedOut()
			case PrivilegeMode.Unprivileged: return this._renderUnprivileged()
			case PrivilegeMode.Privileged: return this._renderPrivileged()
			case PrivilegeMode.Admin: return this._renderAdmin()
		}
	}
}
