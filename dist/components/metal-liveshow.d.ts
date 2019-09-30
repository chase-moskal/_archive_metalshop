import { LiveshowShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalLiveshow extends MetalshopComponent<LiveshowShare> {
    ["video-name"]: string;
    private _viewModel;
    private _viewModelDispose;
    firstUpdated(props: any): void;
    disconnectedCallback(): void;
    render(): import("lit-html/lib/template-result").TemplateResult;
    private renderPrivilegeBox;
    private _handleClickUpdateLivestream;
    private _renderViewer;
}
