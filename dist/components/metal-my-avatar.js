var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, html, css } from "../framework/metalshop-component.js";
let MetalMyAvatar = class MetalMyAvatar extends MetalshopComponent {
    render() {
        const { profile, premium } = this.share;
        const avatar = profile?.avatar || "";
        return html `
			<metal-avatar src=${avatar} ?premium=${premium}></metal-avatar>
		`;
    }
};
MetalMyAvatar = __decorate([
    mixinStyles(css `
	:host {
		display: block;
	}
`)
], MetalMyAvatar);
export { MetalMyAvatar };
//# sourceMappingURL=metal-my-avatar.js.map