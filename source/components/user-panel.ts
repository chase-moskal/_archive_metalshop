
import {listener} from "event-decorators"
import {LitElement, property, html, css} from "lit-element"

import {
	UserLoginEvent,
	UserLogoutEvent
} from "../events.js"


export class UserPanel extends LitElement {

	@property({type: Boolean})
	private _loggedIn: boolean = false
	
	@property({type: Function})
	onLoginClick: (event: MouseEvent) => void = () => {}

	@property({type: Function})
	onLogoutClick: (event: MouseEvent) => void = () => {}

	@listener(UserLoginEvent, {target: window})
	protected _handleUserLogin = (event: UserLoginEvent) => {
		this._loggedIn = true
	}

	@listener(UserLogoutEvent, {target: window})
	protected _handleLogoutEvent = (event: UserLogoutEvent) => {
		this._loggedIn = false
	}

	static get styles() {
		return css``
	}

	render() {
		return html`
			${!this._loggedIn
				? html`<button class="login" @click=${this.onLoginClick}>Login</button>`
				: html``}
			<slot></slot>
			${this._loggedIn
				? html`<button class="logout" @click=${this.onLogoutClick}>Logout</button>`
				: html``}
		`
	}
}
