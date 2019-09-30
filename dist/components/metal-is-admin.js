var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, property, html, css } from "../framework/metalshop-component.js";
let MetalIsAdmin = class MetalIsAdmin extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this["admin"] = false;
        this["not-admin"] = true;
        this.load = loading.load();
    }
    async autorun() {
        const { authLoad, settingsLoad } = this.share;
        const auth = loading.payload(authLoad);
        const settings = loading.payload(settingsLoad);
        const user = auth?.user;
        this["admin"] = false;
        this["not-admin"] = !this["admin"];
        this.load = loading.meta2(authLoad, settingsLoad);
        if (auth && settings || user) {
            this["admin"] = !!user?.claims?.admin && !!settings?.admin?.actAsAdmin;
            this["not-admin"] = !this["admin"];
        }
        this.requestUpdate();
    }
    render() {
        const header = this["fancy"]
            ? html `<p class="header"><strong>Admin-only controls</strong></p>`
            : null;
        return html `
			<iron-loading .load=${this.load}>
				${this["admin"]
            ? html `
						${header}
						<slot></slot>
					`
            : html `
						<slot name="not"></slot>
					`}
			</iron-loading>
		`;
    }
};
__decorate([
    property({ type: Boolean, reflect: true })
], MetalIsAdmin.prototype, "fancy", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], MetalIsAdmin.prototype, "admin", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], MetalIsAdmin.prototype, "not-admin", void 0);
__decorate([
    property({ type: Boolean })
], MetalIsAdmin.prototype, "load", void 0);
MetalIsAdmin = __decorate([
    mixinStyles(css `

	:host([admin][fancy]) {
		display: block;
		padding: 1em 0.5em !important;
		border: 1px solid;
		border-radius: 3px;
		color: var(--metal-admin-color, #ff5c98);
		--coolbutton-background: var(--metal-admin-color, #ff5c98);
	}

	.header {
		opacity: 0.5;
		font-size: 1.2em;
		text-transform: uppercase;
		margin-bottom: 0.5em;
	}

`)
], MetalIsAdmin);
export { MetalIsAdmin };
//# sourceMappingURL=metal-is-admin.js.map