
import {dashify} from "./dashify.js"

export function registerComponents(components: {[name: string]: Function}) {
	for (const [name, component] of Object.entries(components))
		customElements.define(dashify(name), component)
}
