import * as loading from "../toolbox/loading.js";
import { LitElement, TemplateResult } from "lit-element";
export declare class IronLoading<Payload = any> extends LitElement {
    error: string;
    loading: string;
    state: string;
    private _load;
    get load(): loading.Load<Payload>;
    set load(value: loading.Load<Payload>);
    renderNone(): TemplateResult;
    renderLoading(): TemplateResult;
    renderError(reason: string): TemplateResult;
    renderReady(payload: Payload): TemplateResult;
    render(): TemplateResult;
}
