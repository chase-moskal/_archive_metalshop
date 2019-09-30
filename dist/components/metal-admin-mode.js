var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { deepEqual, deepClone } from "../toolbox/deep.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, property, html, css } from "../framework/metalshop-component.js";
let MetalAdminMode = class MetalAdminMode extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.adminMode = false;
        this.adminClaim = false;
        this._handleAdminModeChange = (event) => {
            const adminMode = !!event.currentTarget.checked;
            const { setAdminMode, settingsLoad } = this.share;
            const settings = loading.payload(settingsLoad);
            const newSettings = deepClone(settings);
            newSettings.admin.actAsAdmin = adminMode;
            const changes = !deepEqual(settings, newSettings);
            if (changes)
                return setAdminMode(adminMode);
        };
    }
    async autorun() {
        const { authLoad, settingsLoad } = this.share;
        const settings = loading.payload(settingsLoad);
        const getAuthContext = loading.payload(authLoad)?.getAuthContext;
        if (getAuthContext && settings) {
            const { user } = await getAuthContext();
            this.adminClaim = user.claims.admin;
            this.adminMode = settings.admin.actAsAdmin;
        }
        else {
            this.adminMode = false;
            this.adminClaim = false;
        }
    }
    render() {
        const { adminClaim, adminMode } = this;
        return adminClaim ? html `
			<input
				type="checkbox"
				?checked=${adminMode}
				@change=${this._handleAdminModeChange}
				@keyup=${this._handleAdminModeChange}
				/>
			<label><slot>Admin mode</slot></label>
		` : null;
    }
};
__decorate([
    property({ type: Boolean })
], MetalAdminMode.prototype, "adminMode", void 0);
__decorate([
    property({ type: Boolean })
], MetalAdminMode.prototype, "adminClaim", void 0);
MetalAdminMode = __decorate([
    mixinStyles(css `
	:host {
		color: var(--metal-admin-color, #fd34e2);
	}
 `)
], MetalAdminMode);
export { MetalAdminMode };
//# sourceMappingURL=metal-admin-mode.js.map