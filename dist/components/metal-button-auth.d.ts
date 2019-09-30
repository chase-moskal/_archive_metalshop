import { AccountShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalButtonAuth extends MetalshopComponent<AccountShare> {
    onLoginClick: (event: MouseEvent) => void;
    onLogoutClick: (event: MouseEvent) => void;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
