export var LoadState;
(function (LoadState) {
    LoadState[LoadState["None"] = 0] = "None";
    LoadState[LoadState["Loading"] = 1] = "Loading";
    LoadState[LoadState["Error"] = 2] = "Error";
    LoadState[LoadState["Ready"] = 3] = "Ready";
})(LoadState || (LoadState = {}));
export function load() {
    return { state: LoadState.None };
}
export function select(load, { none, loading, error, ready }) {
    switch (load.state) {
        case LoadState.None: return none();
        case LoadState.Loading: return loading();
        case LoadState.Error: return error(load.reason);
        case LoadState.Ready: return ready(load.payload);
    }
}
export function none() {
    return { state: LoadState.None };
}
export function loading() {
    return { state: LoadState.Loading };
}
export function error(reason) {
    return { state: LoadState.Error, reason };
}
export function ready(payload) {
    return { state: LoadState.Ready, payload };
}
export function payload(load) {
    return (load.state == LoadState.Ready)
        ? load.payload
        : null;
}
export const isNone = (load) => load.state === LoadState.None;
export const isLoading = (load) => load.state === LoadState.Loading;
export const isError = (load) => load.state === LoadState.Error;
export const isReady = (load) => load.state === LoadState.Ready;
export function metameta(...loads) {
    let allNone = true;
    let anyError = false;
    let anyLoading = false;
    let allReady = true;
    for (const load of loads) {
        if (load.state !== LoadState.None)
            allNone = false;
        if (load.state === LoadState.Loading)
            anyLoading = true;
        if (load.state === LoadState.Error)
            anyError = true;
        if (load.state !== LoadState.Ready)
            allReady = false;
    }
    return { allNone, anyError, anyLoading, allReady };
}
export function meta(...loads) {
    const { anyError, anyLoading, allReady } = metameta(...loads);
    return anyError
        ? error()
        : anyLoading
            ? loading()
            : allReady
                ? ready(true)
                : none();
}
export function meta2(...loads) {
    const { allNone, anyError, anyLoading } = metameta(...loads);
    return anyError
        ? error()
        : anyLoading
            ? loading()
            : allNone
                ? none()
                : ready(true);
}
//# sourceMappingURL=loading.js.map