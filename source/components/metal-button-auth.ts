
import {AccountShare} from "../interfaces.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"

const styles = css`

`

 @mixinStyles(styles)
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
