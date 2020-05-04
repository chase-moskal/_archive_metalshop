
//
// TODO decommission
//

export * from "mobx"
import {action, computed, observable} from "mobx"
import {objectMap} from "../toolbox/object-map.js"

export const actionelize =
	<T extends {}>(o: T) => objectMap(o, v => action(v))

export const computelize =
	<T extends {}>(o: T) => objectMap(o, v => computed(v))

export const observelize =
	<T extends {}>(o: T) => objectMap(o, v => observable(v))
