
import {ConstructorFor} from "../interfaces.js"

export type Share = {}
export type ClassWithShare = ConstructorFor<{}>

export function share<
	S extends Share,
	C extends ClassWithShare,
>(Constructor: C, getter: () => S): C {
	return class extends Constructor {
		static get share() { return getter() }
		get share() { return getter() }
	}
}
