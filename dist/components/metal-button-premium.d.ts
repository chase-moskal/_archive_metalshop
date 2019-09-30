import { ButtonPremiumShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalButtonPremium extends MetalshopComponent<ButtonPremiumShare> {
    onSubscribeClick: () => Promise<void>;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
