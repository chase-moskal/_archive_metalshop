
import {Reader} from "../system/interfaces.js"

export function wireStateUpdates<
	S extends {} = {},
	C extends HTMLElement = HTMLElement
>({
	reader,
	components,
	initialPublish,
	updateComponent,
} :{
	components: C[],
	reader: Reader<S>,
	initialPublish: boolean,
	updateComponent: (component: C, state: S) => void,
}) {
	reader.subscribe(state => {
		for (const component of components) updateComponent(component, state)
	})
	if (initialPublish) reader.publishStateUpdate()
}
