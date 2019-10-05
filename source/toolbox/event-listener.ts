
import {dashifyEventName} from "event-decorators"

export function createEventListener<E extends CustomEvent>(
	EventClass: {new(name: string, opts: CustomEventInit): E},
	target: EventTarget,
	options: AddEventListenerOptions,
	listener: (event: E) => void
): () => void {
	const name = dashifyEventName(EventClass)
	target.addEventListener(name, listener)
	return () => target.removeEventListener(name, listener, options)
}
