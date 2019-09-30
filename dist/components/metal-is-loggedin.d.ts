import { AccountShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalIsLoggedin extends MetalshopComponent<AccountShare> {
    ["loaded"]: boolean;
    ["loggedin"]: boolean;
    autorun(): void;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
