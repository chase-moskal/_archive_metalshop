
import {select} from "../toolbox/selects.js"

import {AuthoritarianOptions} from "../interfaces.js"

import {parse} from "./parse.js"
import {initialize} from "./initialize.js"

export async function ascertainOptionsFromDom({selector}: {
	selector: string
}): Promise<AuthoritarianOptions> {

	// grab the <authoritarian-config> element
	const element = select(selector)

	// make sense of the config element's attributes
	const config = parse(element)

	// instantiate microservice facilities, or mocks
	return initialize(config)
}
