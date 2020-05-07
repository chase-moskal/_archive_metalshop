
import {AccountShare} from "../interfaces.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

import * as loading from "../toolbox/loading.js"
import {styles} from "./styles/metal-account-styles.js"
import {mixinStyles} from "../framework/mixin-styles.js"

@mixinStyles(styles)
export class MetalAccount extends MetalshopComponent<AccountShare> {
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	onLoginClick: (event: MouseEvent) => void = () => this.share.login()
	onLogoutClick: (event: MouseEvent) => void = () => this.share.logout()

	firstUpdated() {
		this["initially-hidden"] = false
	}

	render() {
		const {authLoad} = this.share
		const loggedIn = !!loading.payload(authLoad)?.getAuthContext
		return html`
			<iron-loading .load=${authLoad}>
				<slot name="top"></slot>
				${loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
				<slot name="bottom"></slot>
			</iron-loading>
		`
	}

	private renderLoggedIn() {
		return html`
			<slot></slot>
			<div class="wedge logout coolbuttonarea">
				<button @click=${this.onLogoutClick}>
					Logout
				</button>
			</div>
		`
	}

	private renderLoggedOut() {
		return html`
			<div class="wedge login coolbuttonarea">
				<button @click=${this.onLoginClick}>
					Login
				</button>
			</div>
		`
	}
}
