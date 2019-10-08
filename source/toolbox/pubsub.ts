
import {
	Pubsub,
	Pubsubs,
	Pubify,
	Subify,
	Unsubscribe,
	AnyListener,
} from "../system/interfaces.js"

export function pubsub<Listener extends AnyListener = AnyListener>():
	Pubsub<Listener> {
	let listeners: Listener[] = []
	return {
		publish: <Listener>(async(...args: any) => {
			const operations = listeners.map(listener => listener(...args))
			await Promise.all(operations)
		}),
		subscribe(func: Listener): Unsubscribe {
			listeners.push(func)
			return () => {
				listeners = listeners.filter(listener => listener !== func)
			}
		}
	}
}

export function pubsubs<O extends Pubsubs>(
	obj: O // extends infer U ? U : never
): {
	publishers: Pubify<O>
	subscribers: Subify<O>
} {
	const publishers: any = {}
	const subscribers: any = {}
	for (const [key, original] of Object.entries(obj)) {
		publishers[key] = original.publish
		subscribers[key] = original.subscribe
	}
	return {publishers, subscribers}
}
