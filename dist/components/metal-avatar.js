var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { silhouette } from "../system/icons.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, property, html, css } from "../framework/metalshop-component.js";
let MetalAvatar = class MetalAvatar extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.src = "";
        this.defaultPicture = silhouette;
        this.premium = false;
    }
    render() {
        const { src } = this;
        return src
            ? html `<img src=${src} alt=""/>`
            : this.defaultPicture;
    }
};
__decorate([
    property({ type: String })
], MetalAvatar.prototype, "src", void 0);
__decorate([
    property({ type: Object })
], MetalAvatar.prototype, "defaultPicture", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], MetalAvatar.prototype, "premium", void 0);
MetalAvatar = __decorate([
    mixinStyles(css `
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:host {
		--avatar-premium-color: var(--premium-color, yellow);
		display: block;
		width: var(--avatar-size, 3em);
		height: var(--avatar-size, 3em);
		max-width: var(--avatar-max-width, 100%);
		max-height: var(--avatar-max-height, 100%);
		overflow: hidden;
		border: var(--avatar-border, 0 solid rgba(255,255,255, 0.1));
		transition: border 1s ease;
	}

	:host([premium]) {
		border: var(--avatar-border-premium, 4px solid var(--avatar-premium-color));
	}

	:host([hidden]) {
		display: none;
	}

	svg, img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`)
], MetalAvatar);
export { MetalAvatar };
//# sourceMappingURL=metal-avatar.js.map