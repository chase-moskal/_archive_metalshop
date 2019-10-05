
import "menutown/dist/register-all.js"
import "./register-all.js"

import {start} from "./startup/start.js"
import {select} from "./toolbox/selects.js"
import {parseConfigElement} from "./startup/parse-config.js"
import {initializeOptions} from "./startup/initialize-options.js"

main()

async function main() {
	const config = parseConfigElement(select("authoritarian-config"))
	const options = await initializeOptions(config)
	await start(options)
}
