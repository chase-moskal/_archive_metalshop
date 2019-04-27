
export function dashify(camel: string) {
	return camel.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}
