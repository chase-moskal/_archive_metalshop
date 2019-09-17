
import {dashify} from "./dashify.js"

export type EventDetails<T extends CustomEvent> = T extends CustomEvent<infer D> ? D : never

export type Dispatcher<E extends CustomEvent> = (
	options?: CustomEventInit<EventDetails<E>>
) => void

export function dashifyEventName(EventClass: Function) {
	const dashed = dashify(EventClass.name)
	const result = /^(.*)-event$/i.exec(dashed)
	return result ? result[1] : dashed
}

export function prepareEventDecorator(
	fallbackOptions: CustomEventInit = {}
) {
	return function event<E extends CustomEvent>(
		EventClass: new(...args: any[]) => E,
		name2?: string,
	): PropertyDecorator {
		const name = name2 || dashifyEventName(EventClass)
		return (target, key) => {
			target[key] = <any>function(this, options = {}) {
				this.dispatchEvent(new EventClass(
					name,
					{...fallbackOptions, ...options}
				))
			}
		}
	}
}

export const event = prepareEventDecorator()
