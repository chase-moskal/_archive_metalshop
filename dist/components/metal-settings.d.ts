import { SettingsShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalSettings extends MetalshopComponent<SettingsShare> {
    ["hidden"]: boolean;
    autorun(): void;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
