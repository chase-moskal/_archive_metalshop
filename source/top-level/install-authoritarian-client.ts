
import {consoleCurry} from "../console-curry"
import {AuthPanelStore} from "../stores/auth-panel-store"
import {prepAuthMachinery} from "../auth-machinery/prep-auth-machinery"

import {renderAuthPanel} from "./render-auth-panel"
import {InstallAuthMachineryOptions} from "./interfaces"

const debug = consoleCurry({
	tag: "install-authoritarian-client",
	consoleFunction: console.debug
})

/**
 * Install auth ui and behaviors onto the current page
 */
export async function installAuthoritarianClient({
	element,
	tokenApi,
	loginApi,
	decodeAccessToken,
	panelStore = new AuthPanelStore()
}: InstallAuthMachineryOptions) {

	//
	// prepare auth functionality
	//

	const {
		logout,
		passiveCheck,
		promptUserLogin
	} = prepAuthMachinery({
		tokenApi,
		loginApi,
		decodeAccessToken,
		handleAccessData: data => // keep panel store updated
			panelStore.setAccessData(data)
	})

	//
	// render panel ui component on page
	//

	renderAuthPanel({
		element,
		panelStore,
		handleUserLogin: () => {
			debug(`handleUserLogin`)
			promptUserLogin()
		},
		handleUserLogout: () => {
			debug(`handleUserLogout`)
			logout()
		}
	})

	//
	// perform an initial auth check
	//

	await passiveCheck()
}
