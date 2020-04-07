
import {MetalConfig} from "../../interfaces.js"
import {AuthoritarianStartupError} from "../../system/errors.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export function parse(element: HTMLElement): MetalConfig {
	if (!element) throw err(`<metal-config> required, missing`)
	const config = {}
	for (const {name, value} of Array.from(element.attributes)) {
		config[name] = value
	}
	return <MetalConfig>config
}
