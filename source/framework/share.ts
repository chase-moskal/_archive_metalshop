
import {ConstructorFor} from "../interfaces.js"

export type Share = {}

export function share<
	S extends Share,
	C extends ConstructorFor<{}>,
>(Constructor: C, getter: () => S): C {
	return class extends Constructor {
		static get share() { return getter() }
		get share() { return getter() }
	}
}

export abstract class ComponentWithShare<S extends Share> {
	static share: any
	get share() {
		return <S>(<any>this.constructor).share
	}
}

export function mixinShare<
	S extends Share,
	C extends ConstructorFor<{}> = ConstructorFor<{}>,
>(Constructor: C): ConstructorFor<ComponentWithShare<S>> & C {
	return <any>class extends Constructor implements ComponentWithShare<S> {
		static share: S
		get share() {
			return <S>(<any>this.constructor).share
		}
	}
}
