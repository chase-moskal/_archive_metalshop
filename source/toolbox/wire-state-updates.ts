
import {Reader} from "../interfaces.js"

export function wireStateUpdates<
	S extends {} = {},
	C extends HTMLElement = HTMLElement
>({
	reader,
	components,
	updateComponent,
} :{
	components: C[],
	reader: Reader<S>,
	updateComponent: (component: C, state: S) => void,
}) {
	reader.subscribe(state => {
		for (const component of components) updateComponent(component, state)
	})
}
