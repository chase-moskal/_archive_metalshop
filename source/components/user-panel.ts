
import {property, html, css} from "lit-element"

import {UserState} from "../interfaces.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

export class UserPanel extends LoadableElement {
	@property({type: Object}) userState: UserState
	@property({type: Boolean, reflect: true}) ["logged-in"]: boolean = false
	onLoginClick: (event: MouseEvent) => void = () => {}
	onLogoutClick: (event: MouseEvent) => void = () => {}
	loadingMessage = "loading user panel"
	errorMessage = "user account system error"

	updated() {
		if (!this.userState) return
		const {loading, error, loggedIn} = this.userState
		this["logged-in"] = loggedIn
		this.loadableState = error
			? LoadableState.Error
			: loading
				? LoadableState.Loading
				: LoadableState.Ready
	}

	static get styles() {
		return [super.styles, css`
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
		`]
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
		const {_renderLoggedIn, _renderLoggedOut} = this
		const {loggedIn} = this.userState
		return html`
			<slot name="top"></slot>
			${loggedIn ? _renderLoggedIn() : _renderLoggedOut()}
			<slot name="bottom"></slot>
		`
	}
}
