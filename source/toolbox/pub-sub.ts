
export type AnyListener = (...args: any) => void

export function createPubSub<Listener extends AnyListener = AnyListener>(): {
	publish: Listener
	subscribe: (func: Listener) => void
	unsubscribe: (func: Listener) => void
} {

	let listeners: Listener[] = []

	return {
		publish: <Listener>((...args: any) => {
			for (const listener of listeners) listener(...args)
		}),

		subscribe(func: Listener) {
			listeners.push(func)
		},

		unsubscribe(func: Listener) {
			listeners = listeners.filter(listener => listener !== func)
		},
	}
}
