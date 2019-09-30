import { PaywallShare } from "../interfaces.js";
import * as loading from "../toolbox/loading.js";
import { MetalshopComponent, TemplateResult } from "../framework/metalshop-component.js";
export declare class MetalPaywall extends MetalshopComponent<PaywallShare> {
    paywallLoad: loading.Load<void>;
    render(): TemplateResult;
    private renderPanelPremium;
    private renderPanelNoPremium;
    private renderPanelSubscription;
    private renderPanelNoSubscription;
    private loadingOp;
    private handleCheckoutPremiumClick;
    private handleUpdatePremiumClick;
    private handleCancelPremiumClick;
}
