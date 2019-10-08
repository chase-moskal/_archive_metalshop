
import {Reader, Subscribe} from "../system/interfaces.js"

export function makeReader<State extends {} = {}, Sub extends Subscribe = Subscribe>({
	state,
	subscribe
}: Reader<State, Sub>): Reader<State, Sub> {
	return {
		get state() {return Object.freeze({...state})},
		subscribe
	}
}
