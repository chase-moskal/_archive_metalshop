var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { styles } from "./styles/details-styles.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, html, property } from "../framework/metalshop-component.js";
let MetalSettings = class MetalSettings extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this["hidden"] = true;
    }
    autorun() {
        const { user } = this.share;
        const adminClaim = !!user?.claims.admin;
        this["hidden"] = !adminClaim;
    }
    render() {
        const { settingsLoad } = this.share;
        return html `
			<div class="settings">
				<iron-loading .load=${settingsLoad}>
					<metal-admin-mode>Admin mode</metal-admin-mode>
				</iron-loading>
			</div>
		`;
    }
};
__decorate([
    property({ type: Boolean, reflect: true })
], MetalSettings.prototype, "hidden", void 0);
MetalSettings = __decorate([
    mixinStyles(styles)
], MetalSettings);
export { MetalSettings };
//# sourceMappingURL=metal-settings.js.map