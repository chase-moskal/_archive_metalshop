
import {ConstructorFor} from "../interfaces.js"

export type Share = {}

export function share<
	S extends Share,
	C extends ConstructorFor<{}>,
>(Constructor: C, getter: () => S): C {
	return class extends Constructor {
		get share() { return getter() }
	}
}

export type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
	readonly share: S
}>

// export abstract class ComponentWithShare<S extends Share> {
// 	readonly share: S
// }

// export function mixinShare<
// 	S extends Share,
// 	C extends ConstructorFor<{}> = ConstructorFor<{}>,
// >(Constructor: C): ConstructorFor<ComponentWithShare<S>> & C {
// 	return <any>class extends Constructor implements ComponentWithShare<S> {
// 		static share: S
// 		get share() {
// 			return <S>(<any>this.constructor).share
// 		}
// 	}
// }
