
import "menutown/dist/register-all.js"
import {installMetalshop} from "./startup/install-metalshop.js"
import {registerComponents} from "./toolbox/register-components.js"
import {gatherDemoComponents} from "./startup/more/gather-demo-components.js"

~async function() {
	const metalshop = await installMetalshop()
	window["metalshop"] = metalshop

	registerComponents({
		...metalshop.components,
		...gatherDemoComponents(),
	})

	await metalshop.start()
}()
