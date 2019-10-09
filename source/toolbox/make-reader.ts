
import {pubsub} from "./pubsub.js"
import {Reader} from "../system/interfaces.js"

export function makeReader<S extends {} = {}>(state: S): {
	reader: Reader<S>
	publishStateUpdate: () => void
} {
	const {publish, subscribe} = pubsub<(state: S) => void>()
	return {
		reader: {
			subscribe,
			get state() {return Object.freeze({...state})},
		},
		publishStateUpdate: () => publish(Object.freeze({...state})),
	}
}
