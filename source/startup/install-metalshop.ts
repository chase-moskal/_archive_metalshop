
import {MetalOptions} from "../interfaces.js"
import {registerComponents} from "../toolbox/register-components.js"

import {wireComponentShares} from "./more/wire-component-shares.js"
import {optionsFromDom} from "./more/options-from-dom.js"
import {prepareSupermodel} from "./more/prepare-supermodel.js"

export async function installMetalshop(options?: MetalOptions) {
	options = options || await optionsFromDom("metal-config")
	const supermodel = prepareSupermodel(options)
	const components = wireComponentShares(supermodel)
	registerComponents(components)
	return {
		supermodel,
		async start() {
			await supermodel.auth.useExistingLogin()
		}
	}
}
