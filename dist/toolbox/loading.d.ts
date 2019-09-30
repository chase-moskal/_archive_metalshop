export declare enum LoadState {
    None = 0,
    Loading = 1,
    Error = 2,
    Ready = 3
}
export interface LoadBase {
    state: LoadState;
}
export interface LoadNone {
    state: LoadState.None;
}
export interface LoadLoading extends LoadBase {
    state: LoadState.Loading;
}
export interface LoadError extends LoadBase {
    state: LoadState.Error;
    reason: string;
}
export interface LoadReady<P> extends LoadBase {
    state: LoadState.Ready;
    payload: P;
}
export declare type Load<Payload> = LoadNone | LoadLoading | LoadError | LoadReady<Payload>;
export declare function load<Payload>(): Load<Payload>;
export declare function select<Payload, R>(load: Load<Payload>, { none, loading, error, ready }: {
    none: () => R;
    loading: () => R;
    error: (reason: string) => R;
    ready: (payload: Payload) => R;
}): R;
export declare function none(): LoadNone;
export declare function loading(): LoadLoading;
export declare function error(reason?: string): LoadError;
export declare function ready<Payload>(payload?: Payload): LoadReady<Payload>;
export declare function payload<Payload>(load: Load<Payload>): Payload;
export declare const isNone: (load: Load<any>) => boolean;
export declare const isLoading: (load: Load<any>) => boolean;
export declare const isError: (load: Load<any>) => boolean;
export declare const isReady: (load: Load<any>) => boolean;
export declare function metameta(...loads: Load<any>[]): {
    allNone: boolean;
    anyError: boolean;
    anyLoading: boolean;
    allReady: boolean;
};
export declare function meta(...loads: Load<any>[]): Load<true>;
export declare function meta2(...loads: Load<any>[]): Load<true>;
