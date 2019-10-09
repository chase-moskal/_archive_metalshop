
import {Dispatcher, dashifyEventName} from "event-decorators"

export function createEventDispatcher<E extends CustomEvent>(
	EventClass: {new(name: string, opts: CustomEventInit): E},
	target: EventTarget,
	options: CustomEventInit = {}
): Dispatcher<E> {
	return ({detail, ...opts}: CustomEventInit<E> = {}) => {
		const name = dashifyEventName(EventClass)
		target.dispatchEvent(new EventClass(name, {...options, ...opts, detail}))
	}
}
