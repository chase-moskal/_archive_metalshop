
import {AuthoritarianOptions} from "../interfaces.js"

import {wire} from "./wire.js"
import {
	registerComponentsWithModels
} from "./register-components-with-models.js"
import {ascertainOptionsFromDom} from "./ascertain-options-from-dom.js"

export async function installAuthoritarian(options?: AuthoritarianOptions) {

	// use the provided options, or parse them from the dom
	options = options || await ascertainOptionsFromDom()

	// instance the models, and wire them to the dom and each other
	const supermodel = await wire(options)

	// register the components
	registerComponentsWithModels(supermodel)

	// start the passive login routine
	await supermodel.start()

	// return the supermodel for debugging
	return supermodel
}
