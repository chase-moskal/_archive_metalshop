var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MetalshopComponent, html } from "../framework/metalshop-component.js";
import * as loading from "../toolbox/loading.js";
import { styles } from "./styles/metal-account-styles.js";
import { mixinStyles } from "../framework/mixin-styles.js";
let MetalAccount = class MetalAccount extends MetalshopComponent {
    render() {
        const { authLoad } = this.share;
        const loggedIn = !!loading.payload(authLoad)?.getAuthContext;
        return html `
			<iron-loading .load=${authLoad}>
				<slot name="top"></slot>
				${loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
				<slot name="bottom"></slot>
			</iron-loading>
		`;
    }
    renderLoggedIn() {
        return html `
			<slot></slot>
			<div class="wedge logout">
				<metal-button-auth></metal-button-auth>
			</div>
		`;
    }
    renderLoggedOut() {
        return html `
			<div class="wedge login">
				<metal-button-auth></metal-button-auth>
			</div>
		`;
    }
};
MetalAccount = __decorate([
    mixinStyles(styles)
], MetalAccount);
export { MetalAccount };
//# sourceMappingURL=metal-account.js.map