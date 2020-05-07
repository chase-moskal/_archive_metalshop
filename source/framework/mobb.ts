
export * from "mobx"
import {objectMap} from "../toolbox/object-map.js"
import {action, computed, observable, IAction, IComputed, IObservable} from "mobx"

export type Amend<T extends {}> = {[K in keyof T]: T[K]}

export const actionelize =
	<T extends {}>(o: T): Amend<T> =>
		objectMap(o, v => action(v))

export const computelize =
	<T extends {}>(o: T): Amend<T> =>
		objectMap(o, v => computed(v))

export const observelize =
	<T extends {}>(o: T): Amend<T> =>
		objectMap(o, v => observable(v))
