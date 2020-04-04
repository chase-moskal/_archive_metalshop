
import {mixinShare} from "../framework/share.js"
import {AccountShare, AuthMode} from "../interfaces.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {MobxLitElement, property, html, css} from "../framework/mobx-lit-element.js"

const Component = mixinLoadable(
	mixinShare<AccountShare, typeof MobxLitElement>(
		MobxLitElement
	)
)

export class MetalAccount extends Component {
	static get styles() { return [super.styles || css``, styles] }
	loadingMessage = "loading user panel"
	errorMessage = "user account system error"
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean

	@property({type: Boolean, reflect: true}) get ["logged-in"]() {
		return this.share.mode === AuthMode.LoggedIn
	}

	onLoginClick: (event: MouseEvent) => void = () => {
		this.share.login()
	}

	onLogoutClick: (event: MouseEvent) => void = () => {
		this.share.logout()
	}

	firstUpdated() {
		this["initially-hidden"] = false
	}

	updated() {
		const {mode} = this.share
		this.loadableState = (mode === AuthMode.Error)
			? LoadableState.Error
			: (mode === AuthMode.Loading)
				? LoadableState.Loading
				: LoadableState.Ready
	}

	private _renderLoggedIn = () => html`
		<slot></slot>
		<div class="logout coolbuttonarea">
			<button @click=${this.onLogoutClick}>
				Logout
			</button>
		</div>
	`

	private _renderLoggedOut = () => html`
		<div class="login coolbuttonarea">
			<button @click=${this.onLoginClick}>
				Login
			</button>
		</div>
	`

	renderReady() {
		const {
			_renderLoggedIn,
			_renderLoggedOut,
			["logged-in"]: loggedIn,
		} = this

		return html`
			<slot name="top"></slot>
			${loggedIn ? _renderLoggedIn() : _renderLoggedOut()}
			<slot name="bottom"></slot>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}

	div {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.login {
		justify-content: var(--user-panel-login-justify, center);
	}

	.logout {
		justify-content: var(--user-panel-logout-justify, flex-end);
	}

	* + div {
		margin-top: var(--user-panel-margins, 0.5em);
	}

	::slotted(*) {
		display: block;
		margin-top: var(--user-panel-margins, 0.5em) !important;
	}

	::slotted(*:first-child) {
		margin-top: unset !important;
	}
`
