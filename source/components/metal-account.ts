
import {AccountShare, AuthMode} from "../interfaces.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

import * as loading from "../toolbox/loading.js"
import {styles} from "./styles/metal-account-styles.js"
import {mixinStyles} from "../framework/mixin-styles.js"

const authModeToLoad = (mode: AuthMode): loading.Load<void> => {
	switch (mode) {
		case AuthMode.Loading: return loading.loading()
		case AuthMode.Error: return loading.error("auth error")
		case AuthMode.LoggedIn: return loading.ready(null)
		case AuthMode.LoggedOut: return loading.ready(null)
		default: throw new Error("unknown auth mode")
	}
}

@mixinStyles(styles)
export class MetalAccount extends MetalshopComponent<AccountShare> {
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	onLoginClick: (event: MouseEvent) => void = () => this.share.login()
	onLogoutClick: (event: MouseEvent) => void = () => this.share.logout()

	firstUpdated() {
		this["initially-hidden"] = false
	}

	render() {
		const {mode} = this.share
		const load = authModeToLoad(mode)
		const loggedIn = mode === AuthMode.LoggedIn
		return html`
			<iron-loading .load=${load}>
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
