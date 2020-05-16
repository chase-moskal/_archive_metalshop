
const metalConfigTagName = "metal-config"

import {theme} from "./system/theme.js"
import {MetalOptions} from "./interfaces.js"
import {optionsFromDom} from "./startup/options-from-dom.js"
import {themeComponents} from "./framework/theme-components.js"
import {assembleSupermodel} from "./startup/assemble-supermodel.js"
import {wireComponentShares} from "./startup/wire-component-shares.js"

export async function installMetalshop(options?: MetalOptions) {
	options = options || await optionsFromDom(metalConfigTagName)
	const supermodel = assembleSupermodel(options)
	const wiredComponents = wireComponentShares(supermodel)
	const components = themeComponents(theme, wiredComponents)
	return {
		components,
		supermodel,
		async start() {
			await supermodel.auth.useExistingLogin()
		},
	}
}
