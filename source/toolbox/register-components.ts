
import {dashify} from "./dashify.js"

export function registerComponents(components: {[name: string]: Function}) {
	for (const name of Object.keys(components))
		customElements.define(dashify(name), components[name])
}
