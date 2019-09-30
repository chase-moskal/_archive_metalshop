var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { star as starIcon } from "../system/icons.js";
import { styles } from "./styles/metal-paywall-styles.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, html, property } from "../framework/metalshop-component.js";
let MetalPaywall = class MetalPaywall extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.paywallLoad = loading.ready();
        this.loadingOp = async (func) => {
            this.paywallLoad = loading.loading();
            try {
                const result = await func();
                this.paywallLoad = loading.ready();
                return result;
            }
            catch (error) {
                console.error(error);
                this.paywallLoad = loading.error();
                throw error;
            }
        };
    }
    render() {
        const { paywallLoad } = this;
        const { authLoad, settingsLoad, premiumClaim, premiumSubscription } = this.share;
        const totalLoad = loading.meta(authLoad, paywallLoad, settingsLoad);
        return html `
			<iron-loading .load=${totalLoad} class="coolbuttonarea">
				${premiumClaim
            ? this.renderPanelPremium()
            : this.renderPanelNoPremium()}
				${premiumSubscription
            ? this.renderPanelSubscription()
            : this.renderPanelNoSubscription()}
			</iron-loading>
		`;
    }
    renderPanelPremium() {
        return html `
			<div class="panel premium">
				${starIcon}
				<h3>Premium</h3>
			</div>
		`;
    }
    renderPanelNoPremium() {
        return html `
			<div class="panel no-premium">
				<h3>Not premium</h3>
			</div>
		`;
    }
    renderPanelSubscription() {
        const { premiumSubscription } = this.share;
        const { brand, last4, expireYear, expireMonth } = premiumSubscription.card;
        return html `
			<div class="panel subscription">
				<h3>Billing subscription is active</h3>
				<p>${brand} ends in ${last4} expires ${expireYear}/${expireMonth}</p>
				<div class="buttonbar">
					<button class="update" @click=${this.handleUpdatePremiumClick}>
						Update
					</button>
					<button class="cancel" @click=${this.handleCancelPremiumClick}>
						Cancel
					</button>
				</div>
			</div>
		`;
    }
    renderPanelNoSubscription() {
        const { premiumExpires } = this.share;
        const days = (() => {
            if (!premiumExpires)
                return null;
            const duration = premiumExpires - Date.now();
            return Math.ceil(duration / (1000 * 60 * 60 * 24));
        })();
        function calculateDays(premiumExpires) {
            if (!premiumExpires)
                return null;
            const duration = premiumExpires - Date.now();
            const days = Math.ceil(duration / (1000 * 60 * 60 * 24));
            return html `<p>Remaining: ${days} day${days === 1 ? "" : "s"}</p>`;
        }
        return html `
			<div class="panel no-subscription">
				<p>No active billing subscription</p>
				${days
            ? html `<p>Remaining: ${days} day${days === 1 ? "" : "s"}</p>`
            : null}
				<div class="buttonbar">
					<button class="subscribe" @click=${this.handleCheckoutPremiumClick}>
						Subscribe
					</button>
				</div>
			</div>
		`;
    }
    async handleCheckoutPremiumClick() {
        await this.loadingOp(async () => this.share.checkoutPremium());
    }
    async handleUpdatePremiumClick() {
        await this.loadingOp(async () => this.share.updatePremium());
    }
    async handleCancelPremiumClick() {
        await this.loadingOp(async () => this.share.cancelPremium());
    }
};
__decorate([
    property({ type: Object })
], MetalPaywall.prototype, "paywallLoad", void 0);
MetalPaywall = __decorate([
    mixinStyles(styles)
], MetalPaywall);
export { MetalPaywall };
//# sourceMappingURL=metal-paywall.js.map