import { AccountShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalIsPremium extends MetalshopComponent<AccountShare> {
    ["loaded"]: boolean;
    ["premium"]: boolean;
    autorun(): void;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
