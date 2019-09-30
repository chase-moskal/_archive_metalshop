import { LitElement } from "lit-element";
import { ConstructorFor } from "../interfaces.js";
export declare const themeComponents: <C extends ConstructorFor<LitElement>>(theme: import("lit-element").CSSResult | import("lit-element").CSSResultArray, components: {
    [key: string]: C;
}) => {
    [x: string]: any;
};
