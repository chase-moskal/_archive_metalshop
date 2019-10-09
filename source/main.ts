
import "menutown/dist/register-all.js"
import "./system/register-all.js"

import {wire} from "./startup/wire.js"
import {select} from "./toolbox/selects.js"
import {parse} from "./startup/parse.js"
import {initialize} from "./startup/initialize.js"

main()

async function main() {

	// grab the <authoritarian-config> element
	const element = select("authoritarian-config")

	// make sense of the config element's attributes
	const config = parse(element)

	// instantiate microservice facilities, or mocks
	const options = await initialize(config)

	// instance the models and wire them together and to the dom
	const supermodel = await wire(options)

	// start the passive login routine
	await supermodel.start()
}
