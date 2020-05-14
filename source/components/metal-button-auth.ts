
import {AccountShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {MetalshopComponent, html} from "../framework/metalshop-component.js"

export class MetalButtonAuth extends MetalshopComponent<AccountShare> {
	onLoginClick: (event: MouseEvent) => void = () => this.share.login()
	onLogoutClick: (event: MouseEvent) => void = () => this.share.logout()

	render() {
		const {authLoad} = this.share
		const loggedIn = !!loading.payload(authLoad)?.getAuthContext
		return html`
			<iron-loading .load=${authLoad} class="coolbuttonarea">
				${loggedIn ? html`
					<button class="logout" @click=${this.onLogoutClick}>
						Logout
					</button>
				` : html`
					<button class="login" @click=${this.onLoginClick}>
						Login
					</button>
				`}
			</iron-loading>
		`
	}
}
