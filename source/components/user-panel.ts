
import {property, html, css, PropertyValues} from "lit-element"

import {UserState, Reader} from "../system/interfaces.js"
import {mixinStateReader} from "../toolbox/mixin-state-reader.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

export class UserPanel extends mixinStateReader<UserState, typeof LoadableElement>(LoadableElement) {
	reader: Reader<UserState>
	onLoginClick: (event: MouseEvent) => void = () => {}
	onLogoutClick: (event: MouseEvent) => void = () => {}

	@property({type: Object}) state: UserState
	loadingMessage = "loading user panel"
	errorMessage = "user account system error"

	stateUpdateCallback() {
		const {loading, error} = this.state
		this.loadableState = error
			? LoadableState.Error
			: loading
				? LoadableState.Loading
				: LoadableState.Ready
	}

	static get styles() {
		return [LoadableElement.styles, css`
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
		const {loggedIn} = this.state
		return loggedIn ? html`
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
