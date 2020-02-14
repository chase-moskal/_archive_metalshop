
import {AuthoritarianOptions} from "../interfaces.js"

import {theme} from "../system/theme.js"
import {themeComponents} from "../framework/theme-components.js"
import {registerComponents} from "../toolbox/register-components.js"

import {prepareComponents} from "./more/prepare-components.js"
import {ascertainOptionsFromDom} from "./more/ascertain-options-from-dom.js"

export async function installAuthoritarian(options?: AuthoritarianOptions) {

	// use the provided options, or parse them from the dom
	options = options || await ascertainOptionsFromDom({
		selector: "authoritarian-config"
	})

	// create the components all wired up with their models
	const {components, start} = prepareComponents(options)

	// define the custom elements and apply the css theme
	registerComponents(themeComponents(theme, components))

	// give back the start function
	return {start}
}
