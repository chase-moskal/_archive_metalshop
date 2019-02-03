
import {AuthPanelStore} from "../stores/auth-panel-store"

import {renderAuthPanel} from "./render-auth-panel"
import {createAuthMachine} from "./create-auth-machine"
import {InstallAuthoritarianClientOptions} from "./interfaces"

/**
 * Install auth ui and behaviors onto the current page
 *  - glue together the auth machinery and the ui
 *  - kickstart the passive auth check routine
 */
export function installAuthoritarianClient({
	element,
	tokenApi,
	loginApi,
	decodeAccessToken
}: InstallAuthoritarianClientOptions) {

	//
	// prepare auth machinery functions
	// - update the ui with changes (like new access data)
	//
	
	const panelStore = new AuthPanelStore()
	const {logout, passiveCheck, promptUserLogin} = createAuthMachine({
		tokenApi,
		loginApi,
		panelStore,
		decodeAccessToken
	})

	//
	// render panel ui component on page
	// - user actions trigger auth machinery
	//

	renderAuthPanel({
		element,
		panelStore,
		handleUserLogout: logout,
		handleUserLogin: promptUserLogin
	})

	//
	// return the major functions and the store
	//

	return {
		logout,
		panelStore,
		passiveCheck,
		promptUserLogin
	}
}
