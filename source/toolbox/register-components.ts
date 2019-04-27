
import {dashify} from "./dashify.js"
import {Component} from "./component.js"

export function registerComponents(components: typeof Component[]) {
	for (const Component of components)
		customElements.define(dashify(Component.name), Component)
}
