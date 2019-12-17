
import {LitElement, property, html, css} from "lit-element"

import {UserMode} from "../models/user-model.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

import {UserModel} from "../interfaces.js"

export class UserPanel extends
	mixinLoadable(
		mixinModelSubscription<UserModel, typeof LitElement>(
			LitElement
		)
	)
{
	static get styles() { return [super.styles || css``, styles] }
	loadingMessage = "loading user panel"
	errorMessage = "user account system error"

	@property({type: Boolean, reflect: true}) get ["logged-in"]() {
		return this.model.reader.state.mode === UserMode.LoggedIn
	}

	onLoginClick: (event: MouseEvent) => void = () => {
		this.model.login()
	}

	onLogoutClick: (event: MouseEvent) => void = () => {
		this.model.logout()
	}

	updated() {
		const {mode} = this.model.reader.state
		this.loadableState = (mode === UserMode.Error)
			? LoadableState.Error
			: (mode === UserMode.Loading)
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
