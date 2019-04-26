
import {LitElement, css, html} from "lit-element"

export class AuthSlate extends LitElement {

	get styles() {
		return css`
			* {}
		`
	}

	render() {
		return html`
			<div>
				<slot></slot>
			</div>
		`
	}
}

customElements.define("auth-slate", AuthSlate)
