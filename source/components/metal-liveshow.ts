
import {cancel} from "../system/icons.js"
import {select} from "../toolbox/selects.js"
import {WithShare} from "../framework/share.js"
import {LiveshowViewModel} from "../models/liveshow-model.js"
import {LiveshowShare, AuthMode, PrivilegeMode} from "../interfaces.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {MobxLitElement, property, html, css} from "../framework/mobx-lit-element.js"

const Component = mixinLoadable(
	<WithShare<LiveshowShare, typeof MobxLitElement>>
		MobxLitElement
)

export class MetalLiveshow extends Component {
	static get styles() { return [super.styles || css``, styles] }
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: String, reflect: true}) ["video-name"]: string
	private _viewModel: LiveshowViewModel
	private _viewModelDispose: () => void

	firstUpdated() {
		this["initially-hidden"] = false
		const {["video-name"]: videoName} = this
		const {viewModel, dispose} = this.share.makeViewModel({videoName})
		this._viewModel = viewModel
		this._viewModelDispose = dispose
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		if (this._viewModelDispose) this._viewModelDispose()
	}

	updated() {
		const {authMode} = this.share
		const loadingState = (mode: LoadableState) => this.loadableState = mode
		this.errorMessage = "error"
		console.log("AUTHMODE", authMode)
		switch (authMode) {
			case AuthMode.Error:
				loadingState(LoadableState.Error)
				break
			case AuthMode.Loading:
				loadingState(LoadableState.Loading)
				break
			case AuthMode.LoggedIn:
			case AuthMode.LoggedOut:
			default: {
				if (this._viewModel.errorMessage) {
					loadingState(LoadableState.Error)
					this.errorMessage = this._viewModel.errorMessage
				}
				else if (this._viewModel.loading) {
					loadingState(LoadableState.Loading)
				}
				else {
					loadingState(LoadableState.Ready)
				}
			}
		}
	}

	renderReady() {
		const {mode} = this._viewModel
		switch (mode) {
			case PrivilegeMode.Unknown: return this._renderLoggedOut()
			case PrivilegeMode.Unprivileged: return this._renderUnprivileged()
			case PrivilegeMode.Privileged: return this._renderPrivileged()
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

	private _renderLoggedOut() {
		return html`
			<slot name="loggedout">
				<h2>Private video</h2>
				<p>You must be logged in to view this video</p>
			</slot>
			<div class="ghostplayer">${cancel}</div>
		`
	}

	private _renderUnprivileged() {
		return html`
			<slot name="unprivileged">
				<h2>Private video</h2>
				<p>Your account does not have privilege to watch this video</p>
			</slot>
			<div class="ghostplayer">${cancel}</div>
		`
	}

	private _renderViewer() {
		const {vimeoId} = this._viewModel
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

	private _renderPrivileged() {
		const {validationMessage} = this._viewModel
		return html`
			<slot></slot>
			${this._renderViewer()}
			<metal-admin-only class="adminpanel coolbuttonarea formarea" block header>
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
					: null}
			</metal-admin-only>
		`
	}
}

const styles = css`
	:host, :host > * {
		display: block;
	}

	:host([hidden]) {
		display: none;
	}

	* + .ghostplayer,
	* + .viewer,
	* + metal-admin-only > .adminpanel {
		margin-top: 1em;
	}

	.ghostplayer {
		position: relative;
		display: block;
		width: 100%;
		color: var(--vimeo-ghostplayer-color, inherit);
		background: var(--vimeo-ghostplayer-background, rgba(0,0,0, 0.2));
		border: var(--vimeo-ghostplayer-border, 0.2em solid rgba(0,0,0, 0.1));
	}

	.ghostplayer::before {
		content: "";
		display: block;
		padding-top: var(--vimeo-aspect-percentage, 56.25%);
	}

	.ghostplayer svg {
		position: absolute;
		opacity: var(--vimeo-ghostplayer-icon-opacity, 0.5);
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		width: 30%;
		height: 30%;
		max-width: 10em;
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
		padding-top: var(--vimeo-aspect-percentage, 56.25%);
	}

	.viewer iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	metal-admin-only {
		display: block;
		max-width: 420px;
		margin-top: 0.5em;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	metal-admin-only p,
	metal-admin-only h3 {
		margin: 0.1em 0.5em;
	}

	metal-admin-only h3 {
		text-transform: uppercase;
	}

	metal-admin-only .inputarea {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	metal-admin-only .inputarea > * {
		flex: 1 1 auto;
		margin: 0.5em;
		max-width: 100%;
	}

	metal-admin-only .inputarea > button {
		flex: 0 1 auto;
		margin-left: auto;
	}

	.error {
		color: red;
		border: 1px solid;
		border-radius: 3px;
	}
`
