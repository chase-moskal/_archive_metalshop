import { AccountShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalAccount extends MetalshopComponent<AccountShare> {
    render(): import("lit-html/lib/template-result").TemplateResult;
    private renderLoggedIn;
    private renderLoggedOut;
}
