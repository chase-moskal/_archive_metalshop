
import {Component} from "./component.js"

function dashify(camel: string) {
	return camel.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

export function registerComponents(components: typeof Component[]) {
	for (const Component of components)
		customElements.define(dashify(Component.name), Component)
}
