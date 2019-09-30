import { ConstructorFor } from "../interfaces.js";
export declare type Share = {};
export declare const share: <S extends Share, C extends ConstructorFor<{}>>(Constructor: C, getter: () => S) => {
    new (...args: any[]): {
        readonly share: S;
    };
} & C;
export declare type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
    readonly share: S;
}>;
