
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
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}

			:host {
				display: block;
				position: relative;
				min-width: 3em;
				min-height: 3em;
			}

			.icon {
				position: absolute;
				width: 100%;
				height: 100%;
				background-size: cover;
				background-position: center center;
			}
		`
	}

	store: AuthStore

	render() {
		const {profilePicture} = this.store
		const bg = profilePicture
			? `background-image: url("${profilePicture}");`
			: ""
		return html`
			<div class="icon" style="${bg}">
				<slot></slot>
			</div>
		`
	}
}
