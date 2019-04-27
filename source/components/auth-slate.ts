
import {LitElement, css, html} from "lit-element"
import {AuthStore} from "../interfaces.js"

export class AuthSlate extends LitElement {
	static get properties() {
		return {
			store: {type: Object}
		}
	}

	static get styles() {
		return css`
			* {}
		`
	}

	store: AuthStore

	render() {
		return html`
			<div>
				${
					this.store.loggedIn
						?	html`<p>Logged in</p>`
						: html`<p>Logged out</p>`
				}
				<slot></slot>
			</div>
		`
	}
}
