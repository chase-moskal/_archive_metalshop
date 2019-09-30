export * from "mobx";
export declare type Amend<T extends {}> = {
    [K in keyof T]: T[K];
};
export declare const actionelize: <T extends {}>(o: T) => Amend<T>;
export declare const computelize: <T extends {}>(o: T) => Amend<T>;
export declare const observelize: <T extends {}>(o: T) => Amend<T>;
