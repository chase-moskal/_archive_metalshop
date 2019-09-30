var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, action, computed } from "mobx";
export class PaywallModel {
    constructor(options) {
        Object.assign(this, options);
    }
    get premiumClaim() {
        return !!this.auth?.user?.claims?.premium;
    }
    get premiumExpires() {
        return this.settings?.settings?.premium?.expires;
    }
    get premiumSubscription() {
        return this.settings?.settings?.billing?.premiumSubscription;
    }
    async checkoutPremium() {
        const { accessToken } = await this.auth.getAuthContext();
        const { stripeSessionId } = await this.paywallLiaison.checkoutPremium({
            accessToken,
            popupUrl: this.checkoutPopupUrl,
        });
        await this.triggerCheckoutPopup({ stripeSessionId });
        await this.auth.reauthorize();
    }
    async updatePremium() {
        const { accessToken } = await this.auth.getAuthContext();
        const { stripeSessionId } = await this.paywallLiaison.updatePremium({
            accessToken,
            popupUrl: this.checkoutPopupUrl,
        });
        await this.triggerCheckoutPopup({ stripeSessionId });
        await this.auth.reauthorize();
    }
    async cancelPremium() {
        const { accessToken } = await this.auth.getAuthContext();
        await this.paywallLiaison.cancelPremium({ accessToken });
        await this.auth.reauthorize();
    }
}
__decorate([
    observable
], PaywallModel.prototype, "auth", void 0);
__decorate([
    observable
], PaywallModel.prototype, "profile", void 0);
__decorate([
    observable
], PaywallModel.prototype, "settings", void 0);
__decorate([
    computed
], PaywallModel.prototype, "premiumClaim", null);
__decorate([
    computed
], PaywallModel.prototype, "premiumExpires", null);
__decorate([
    computed
], PaywallModel.prototype, "premiumSubscription", null);
__decorate([
    action.bound
], PaywallModel.prototype, "checkoutPremium", null);
__decorate([
    action.bound
], PaywallModel.prototype, "updatePremium", null);
__decorate([
    action.bound
], PaywallModel.prototype, "cancelPremium", null);
//# sourceMappingURL=paywall-model.js.map