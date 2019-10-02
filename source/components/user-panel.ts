
import {listener} from "event-decorators"
import {LitElement, property, html, css} from "lit-element"

import {
	UserLoginEvent,
	UserLogoutEvent,
	UserLoadingEvent,
} from "../events.js"

export class UserPanel extends LitElement {

	@property({type: Boolean})
	private _loading: boolean = true

	@property({type: Boolean})
	private _loggedIn: boolean = false
	
	@property({type: Function})
	onLoginClick: (event: MouseEvent) => void = () => {}

	@property({type: Function})
	onLogoutClick: (event: MouseEvent) => void = () => {}

	@listener(UserLoadingEvent, {target: window})
	protected _handleUserLoading = (event: UserLoadingEvent) => {
		this._loggedIn = false
		this._loading = true
	}

	@listener(UserLoginEvent, {target: window})
	protected _handleUserLogin = (event: UserLoginEvent) => {
		this._loggedIn = true
		this._loading = false
	}

	@listener(UserLogoutEvent, {target: window})
	protected _handleLogoutEvent = (event: UserLogoutEvent) => {
		this._loggedIn = false
		this._loading = false
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			div {
				text-align: left;
			}
			button {
				font-weight: bold;
				font-size: 1.2em;
				border: none;
				padding: 0.2em 1em;
				background: #00a464;
				color: white;
				box-shadow: 1px 2px 1px rgba(0,0,0, 0.15);
				text-shadow: 0 0 7px rgba(255,255,255, 0.4);
				cursor: pointer;
			}
			button:hover, button:focus {
				background: rgb(8, 175, 110);
				text-decoration: underline;
				text-shadow: 0 0 7px rgba(255,255,255, 0.7);
			}
			button:active {
				background: rgb(21, 185, 121);
			}
			* + div {
				margin-top: 0.5em;
			}
		`
	}

	private _renderLoginButtonMaybe() {
		return !this._loggedIn
			? html`<div><button class="login" @click=${this.onLoginClick}>Login</button></div>`
			: html``
	}

	private _renderLogoutButtonMaybe() {
		return this._loggedIn
			? html`<div><button class="logout" @click=${this.onLogoutClick}>Logout</button></div>`
			: html``
	}

	render() {
		return this._loading
			? html`<div class="loading">loading user</div>`
			: html`
				${this._renderLoginButtonMaybe()}
				<slot></slot>
				${this._renderLogoutButtonMaybe()}
			`
	}
}
