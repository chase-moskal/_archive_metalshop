
import {initialize} from "./initialize.js"
import {select} from "../toolbox/selects.js"
import {parseConfig} from "./parse-config.js"
import {MetalOptions} from "../interfaces.js"

export async function optionsFromDom(selector: string): Promise<MetalOptions> {
	const element = select(selector)
	const config = parseConfig(element)
	return initialize(config)
}
