var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { MetalshopComponent, html, property } from "../framework/metalshop-component.js";
export class MetalIsPremium extends MetalshopComponent {
    autorun() {
        const { authLoad } = this.share;
        const authPayload = loading.payload(authLoad);
        this["loaded"] = !!authPayload;
        this["premium"] = !!authPayload?.user?.claims.premium;
    }
    render() {
        const { authLoad } = this.share;
        return html `
			<iron-loading .load=${authLoad}>
				${this["premium"]
            ? html `<slot></slot>`
            : html `<slot name="not"></slot>`}
			</iron-loading>
		`;
    }
}
__decorate([
    property({ type: Boolean, reflect: true })
], MetalIsPremium.prototype, "loaded", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], MetalIsPremium.prototype, "premium", void 0);
//# sourceMappingURL=metal-is-premium.js.map