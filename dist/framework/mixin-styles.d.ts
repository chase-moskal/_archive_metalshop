import { ConstructorFor } from "../interfaces.js";
import { LitElement, CSSResult, CSSResultArray } from "lit-element";
export declare type CSS = CSSResult | CSSResultArray;
export declare function mixinStyles(style: CSS, ...moreStyles: CSS[]): <C extends ConstructorFor<LitElement> & {
    styles?: CSSResult | CSSResultArray;
}>(Constructor: C) => C & {
    styles: CSSResultArray;
};
