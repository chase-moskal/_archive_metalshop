
import {theme} from "../system/theme.js"
import {MetalOptions} from "../interfaces.js"
import {themeComponents} from "../framework/theme-components.js"
import {registerComponents} from "../toolbox/register-components.js"

import {wireSupermodel} from "./more/wire-supermodel.js"
import {optionsFromDom} from "./more/options-from-dom.js"
import {prepareComponents} from "./more/prepare-components.js"

export async function installMetalshop(options?: MetalOptions) {
	options = options || await optionsFromDom("metal-config")
	const supermodel = wireSupermodel(options)
	const components = prepareComponents(supermodel)
	registerComponents(themeComponents(theme, components))
	return {
		supermodel,
		async start() {
			await supermodel.auth.useExistingLogin()
		}
	}
}
