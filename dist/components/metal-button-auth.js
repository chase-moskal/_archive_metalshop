import * as loading from "../toolbox/loading.js";
import { MetalshopComponent, html } from "../framework/metalshop-component.js";
export class MetalButtonAuth extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.onLoginClick = () => this.share.login();
        this.onLogoutClick = () => this.share.logout();
    }
    render() {
        const { authLoad } = this.share;
        const loggedIn = !!loading.payload(authLoad)?.getAuthContext;
        return html `
			<iron-loading .load=${authLoad} class="coolbuttonarea">
				${loggedIn ? html `
					<button class="logout" @click=${this.onLogoutClick}>
						Logout
					</button>
				` : html `
					<button class="login" @click=${this.onLoginClick}>
						Login
					</button>
				`}
			</iron-loading>
		`;
    }
}
//# sourceMappingURL=metal-button-auth.js.map