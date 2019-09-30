import { MobxLitElement } from "@adobe/lit-mobx";
import { Share } from "./share.js";
export * from "lit-element";
export { Share, MobxLitElement };
export declare class MetalshopComponent<S extends Share> extends MobxLitElement {
    readonly share: S;
}
