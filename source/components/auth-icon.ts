
import {AuthStore} from "../interfaces.js"
import {Component, css, html} from "../toolbox/component.js"

export class AuthIcon extends Component {
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
		const profilePicture = this.store.profilePicture
		const bg = profilePicture ? `background-image: url("${profilePicture}");` : ""
		return html`
			<div style="${bg}">
				<slot></slot>
			</div>
		`
	}
}
