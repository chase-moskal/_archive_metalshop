
import {LitElement, css, html} from "lit-element"

export class AuthIcon extends LitElement {

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

customElements.define("auth-icon", AuthIcon)
