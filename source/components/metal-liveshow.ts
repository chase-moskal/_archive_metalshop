
import {cancel} from "../system/icons.js"
import {select} from "../toolbox/selects.js"
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "./styles/metal-liveshow-styles.js"
import {LiveshowViewModel} from "../models/liveshow-model.js"
import {LiveshowShare, PrivilegeLevel} from "../interfaces.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

 @mixinStyles(styles)
export class MetalLiveshow extends MetalshopComponent<LiveshowShare> {

	@property({type: String, reflect: true})
		["video-name"]: string

	private _viewModel: LiveshowViewModel
	private _viewModelDispose: () => void

	firstUpdated(props) {
		super.firstUpdated(props)
		const {["video-name"]: videoName} = this
		const {viewModel, dispose} = this.share.makeViewModel({videoName})
		this._viewModel = viewModel
		this._viewModelDispose = () => {
			this._viewModel = null
			dispose()
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		if (this._viewModelDispose) this._viewModelDispose()
	}

	render() {
		const {authLoad} = this.share
		const privilege = this._viewModel?.privilege
		return html`
			<iron-loading .load=${authLoad}>
				${this.renderPrivilegeBox(privilege)}
			</iron-loading>
		`
	}

	private renderPrivilegeBox(privilege: PrivilegeLevel) {
		const {validationMessage} = this._viewModel || {}
		switch (privilege) {
			case PrivilegeLevel.Unknown: return html`
				<slot name="unknown">
					<h2>Private video</h2>
					<p>You must be logged in to view this video</p>
				</slot>
				<div class="ghostplayer">${cancel}</div>
			`
			case PrivilegeLevel.Unprivileged: return html`
				<slot name="unprivileged">
					<h2>Private video</h2>
					<p>Your account does not have privilege to watch this video</p>
				</slot>
				<div class="ghostplayer">${cancel}</div>
			`
			case PrivilegeLevel.Privileged: return html`
				<slot></slot>
				${this._renderViewer()}
				<metal-is-admin fancy class="adminpanel coolbuttonarea formarea">
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
					${validationMessage && html`
						<p class="error">${validationMessage}</p>
					`}
				</metal-is-admin>
			`
		}
	}

	private _handleClickUpdateLivestream = () => {
		const input = select<HTMLInputElement>(
			"input[name=vimeostring]",
			this.shadowRoot
		)
		this._viewModel.updateVideo(input.value)
		input.value = ""
	}

	private _renderViewer() {
		const {vimeoId} = loading.payload(this._viewModel.videoLoad) || {}
		const query = "?color=00a651&title=0&byline=0&portrait=0&badge=0"
		return vimeoId ? html`
			<div class="viewer">
				<iframe
					frameborder="0"
					allowfullscreen
					allow="autoplay; fullscreen"
					src="https://player.vimeo.com/video/${vimeoId}${query}"
				></iframe>
			</div>
		` : html`
			<div class="missing ghostplayer">
				<p>video missing</p>
			</div>
		`
	}
}
