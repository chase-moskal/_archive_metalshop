import { LitElement } from "lit-element";
import { ConstructorFor } from "../interfaces.js";
declare type MixinIn = ConstructorFor<LitElement>;
declare type MixinOut<C extends MixinIn> = C & ConstructorFor<{
    autorun: () => void;
}>;
export declare function mixinAutorun<C extends MixinIn>(Constructor: C): MixinOut<C>;
export {};
