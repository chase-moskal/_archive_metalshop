
import {MetalOptions} from "../interfaces.js"
import {registerComponents} from "../toolbox/register-components.js"

import {optionsFromDom} from "./more/options-from-dom.js"
import {prepareSupermodel} from "./more/prepare-supermodel.js"
import {wireComponentShares} from "./more/wire-component-shares.js"
import {gatherDemoComponents} from "./more/gather-demo-components.js"

export async function installMetalshop(options?: MetalOptions) {
	options = options || await optionsFromDom("metal-config")
	const supermodel = prepareSupermodel(options)
	registerComponents({
		...wireComponentShares(supermodel),
		...gatherDemoComponents(),
	})
	return {
		supermodel,
		async start() {
			await supermodel.auth.useExistingLogin()
		}
	}
}
