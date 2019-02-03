
import {AuthPanelStore} from "../stores/auth-panel-store"
import {prepAuthMachinery} from "../auth-machinery/prep-auth-machinery"

import {renderAuthPanel} from "./render-auth-panel"
import {InstallAuthoritarianClientOptions} from "./interfaces"

/**
 * Install auth ui and behaviors onto the current page
 *  - glue together the auth machinery and the ui
 *  - kickstart the passive auth check routine
 */
export async function installAuthoritarianClient({
	element,
	tokenApi,
	loginApi,
	decodeAccessToken,
	panelStore = new AuthPanelStore()
}: InstallAuthoritarianClientOptions) {

	//
	// prepare auth machinery functions
	//  - update the ui with changes (like new access data)
	//

	const {
		logout,
		passiveCheck,
		promptUserLogin
	} = prepAuthMachinery({
		tokenApi,
		loginApi,
		decodeAccessToken,
		handleAccessData: data => // keep store updated
			panelStore.setAccessData(data)
	})

	//
	// render panel ui component on page
	//  - user actions trigger auth machinery
	//

	renderAuthPanel({
		element,
		panelStore,
		handleUserLogout: () => logout(), // perform auth actions
		handleUserLogin: () => promptUserLogin()
	})

	//
	// perform an initial auth check
	//

	await passiveCheck()
}
