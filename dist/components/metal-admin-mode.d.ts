import { AdminModeShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalAdminMode extends MetalshopComponent<AdminModeShare> {
    private adminMode;
    private adminClaim;
    autorun(): Promise<void>;
    render(): import("lit-html/lib/template-result").TemplateResult;
    private _handleAdminModeChange;
}
