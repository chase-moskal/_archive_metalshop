
import {AccountShare, AuthMode} from "../interfaces.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

import * as loading from "../toolbox/loading.js"
import {litLoading} from "../toolbox/lit-loading.js"
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

@mixinStyles(css`
	:host {
		display: block;
	}

	.wedge {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.login {
		justify-content: var(--metal-account-login-justify, center);
	}

	.logout {
		justify-content: var(--metal-account-logout-justify, flex-end);
	}

	* + div {
		margin-top: var(--metal-account-margins, 0.5em);
	}

	::slotted(*) {
		display: block;
		margin-top: var(--metal-account-margins, 0.5em) !important;
	}

	::slotted(*:first-child) {
		margin-top: unset !important;
	}
`)
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
		return litLoading(load, () => html`
			<slot name="top"></slot>
			${loggedIn
				? html`
					<slot></slot>
					<div class="wedge logout coolbuttonarea">
						<button @click=${this.onLogoutClick}>
							Logout
						</button>
					</div>
				`
				: html`
					<div class="wedge login coolbuttonarea">
						<button @click=${this.onLoginClick}>
							Login
						</button>
					</div>
				`
			}
			<slot name="bottom"></slot>
		`)
	}
}
