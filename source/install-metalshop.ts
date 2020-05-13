
import {MetalOptions} from "./interfaces.js"
import {optionsFromDom} from "./startup/options-from-dom.js"
import {prepareSupermodel} from "./startup/prepare-supermodel.js"
import {wireComponentShares} from "./startup/wire-component-shares.js"

const metalConfigTagName = "metal-config"

export async function installMetalshop(options?: MetalOptions) {
	options = options || await optionsFromDom(metalConfigTagName)

	const supermodel = prepareSupermodel(options)
	const components = wireComponentShares(supermodel)

	async function start() {
		await supermodel.auth.useExistingLogin()
	}

	return {start, components, supermodel}
}
