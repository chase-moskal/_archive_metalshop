
import {parse} from "./parse.js"
import {initialize} from "./initialize.js"
import {select} from "../../toolbox/selects.js"
import {MetalOptions} from "../../interfaces.js"

export async function optionsFromDom(selector: string): Promise<MetalOptions> {
	const element = select(selector)
	const config = parse(element)
	return initialize(config)
}
