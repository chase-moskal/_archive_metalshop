import { AdminOnlyShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalIsAdmin extends MetalshopComponent<AdminOnlyShare> {
    ["fancy"]: boolean;
    ["admin"]: boolean;
    ["not-admin"]: boolean;
    private load;
    autorun(): Promise<void>;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
