
import {ConstructorFor} from "../interfaces.js"

export type Share = {}

export const share = <S extends Share, C extends ConstructorFor<{}>>(
	Constructor: C,
	getter: () => S
) => class extends Constructor {
	get share() { return getter() }
}

export type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
	readonly share: S
}>
