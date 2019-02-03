
import {AuthPanelStore} from "../stores/auth-panel-store"
import {prepAuthMachinery} from "../auth-machinery/prep-auth-machinery"

import {renderAuthPanel} from "./render-auth-panel"
import {InstallAuthoritarianClientOptions} from "./interfaces"

/**
 * Install auth ui and behaviors onto the current page
 */
export async function installAuthoritarianClient({
	element,
	tokenApi,
	loginApi,
	decodeAccessToken,
	panelStore = new AuthPanelStore()
}: InstallAuthoritarianClientOptions) {

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
		handleUserLogin: () => promptUserLogin(),
		handleUserLogout: () => logout()
	})

	//
	// perform an initial auth check
	//

	await passiveCheck()
}
