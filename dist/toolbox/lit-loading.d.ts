import * as loading from "../toolbox/loading.js";
import { TemplateResult } from "lit-element";
export declare const litLoading: <Payload>(load: loading.Load<Payload>, renderReady: (payload: Payload) => TemplateResult) => TemplateResult;
export declare const litLoadingStyles: import("lit-element").CSSResult;
