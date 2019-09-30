import { CountdownShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalCountdown extends MetalshopComponent<CountdownShare> {
    ["event-name"]: string;
    adminDate: number;
    adminTime: number;
    adminValidationMessage: string;
    private _interval;
    firstUpdated(props: any): Promise<void>;
    disconnectedCallback(): void;
    render(): import("lit-html/lib/template-result").TemplateResult;
    private renderScheduled;
    private renderUnscheduled;
    private renderAdminPanel;
    private get adminDateTime();
    private _handleUpdateDate;
    private _handleUpdateTime;
    private _updateValidation;
    private _handleScheduleClick;
    private _handleUnscheduleClick;
}
