
import "menutown/dist/register-all.js"

import {installMetalshop} from "./install-metalshop.js"
import {registerComponents} from "./toolbox/register-components.js"

~async function startMetalshop() {
	const metalshop = await installMetalshop()
	registerComponents(metalshop.components)
	await metalshop.start()
}()
