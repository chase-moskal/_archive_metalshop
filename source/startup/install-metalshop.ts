
import {MetalOptions} from "../interfaces.js"
import {optionsFromDom} from "./more/options-from-dom.js"
import {prepareSupermodel} from "./more/prepare-supermodel.js"
import {wireComponentShares} from "./more/wire-component-shares.js"

export async function installMetalshop(options?: MetalOptions) {
	options = options || await optionsFromDom("metal-config")

	const supermodel = prepareSupermodel(options)
	const components = wireComponentShares(supermodel)

	async function start() {
		await supermodel.auth.useExistingLogin()
	}

	return {start, components, supermodel}
}
