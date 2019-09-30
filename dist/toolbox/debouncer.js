export function makeDebouncer({ delay, action }) {
    let timeout = null;
    function queue() {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(() => {
            action();
            timeout = null;
        }, delay);
    }
    function setAction(newAction) {
        action = newAction;
    }
    return { queue, setAction };
}
// export class DebouncerClass implements Debouncer {
// 	private _delay: number
// 	private _action: () => void
// 	private _timeout: any = null
// 	constructor({action, delay}: {
// 		delay: number
// 		action: () => void
// 	}) {
// 		this._action = action
// 		this._delay = delay
// 	}
// 	queue = () => {
// 		if (this._timeout !== null) {
// 			clearTimeout(this._timeout)
// 			this._timeout = null
// 		}
// 		this._timeout = setTimeout(() => {
// 			this._action()
// 			this._timeout = null
// 		}, this._delay)
// 	}
// }
//# sourceMappingURL=debouncer.js.map