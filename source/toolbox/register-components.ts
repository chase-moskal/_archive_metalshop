
export function registerComponents(components: {[name: string]: Function}) {
	for (const name of Object.keys(components))
		customElements.define(dashify(name), components[name])
}

function dashify(camel: string) {
	return camel.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}
