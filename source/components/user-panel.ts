
import {listener} from "event-decorators"
import {property, html, css} from "lit-element"

import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	UserLoadingEvent,
	UserErrorEvent,
} from "../system/events.js"

export class UserPanel extends LoadableElement {
	loadingMessage = "loading user panel"

	@property({type: Boolean})
	private _loggedIn: boolean = false
	
	@property({type: Function})
	onLoginClick: (event: MouseEvent) => void = () => {}

	@property({type: Function})
	onLogoutClick: (event: MouseEvent) => void = () => {}

	@listener(UserLoadingEvent, {target: window})
	protected _handleUserLoading = (event: UserLoadingEvent) => {
		this._loggedIn = false
		this.loadableState = LoadableState.Loading
	}

	@listener(UserErrorEvent, {target: window})
	protected _handleUserError = (event: UserErrorEvent) => {
		this._loggedIn = false
		this.loadableState = LoadableState.Error
	}

	@listener(UserLoginEvent, {target: window})
	protected _handleUserLogin = (event: UserLoginEvent) => {
		this._loggedIn = true
		this.loadableState = LoadableState.Ready
	}

	@listener(UserLogoutEvent, {target: window})
	protected _handleLogoutEvent = (event: UserLogoutEvent) => {
		this._loggedIn = false
		this.loadableState = LoadableState.Ready
	}

	static get styles() {
		return [super.styles, css`
			:host {
				display: block;
			}
			div {
				text-align: center;
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

	renderReady() {
		return this._loggedIn ? html`
				<slot></slot>
				<div>
					<button class="logout" @click=${this.onLogoutClick}>
						Logout
					</button>
				</div>
		` : html`
			<div>
				<button class="login" @click=${this.onLoginClick}>
					Login
				</button>
			</div>
		`
	}
}
