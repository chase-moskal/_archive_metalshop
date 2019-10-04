
import {selects, select} from "./toolbox/selects.js"
import {UserPanel} from "./components/user-panel.js"
import {decodeAccessToken as defaultDecodeAccessToken} from "./toolbox/decode-access-token.js"
import {accountPopupLogin as defaultAccountPopupLogin} from "./integrations/account-popup-login.js"

import {setupUser} from "./setups/setup-user.js"
import {AuthoritarianOptions} from "./interfaces.js"
import {setupProfile} from "./setups/setup-profile.js"
import {setupPaywall} from "./setups/setup-paywall.js"

export async function authoritarianStart(options: AuthoritarianOptions = {}) {

	// unpack options
	const {
		profiler,
		tokenStorage,
		config = select("authoritarian-config"),
		accountPopupLogin = defaultAccountPopupLogin,
		decodeAccessToken = defaultDecodeAccessToken,
	} = options
	if (!config) throw new Error(`<authoritarian-config> element required`)
	const eventTarget = document.body

	// setup the profile
	await setupProfile({config, eventTarget, profiler})

	// setup the user
	const userModel = await setupUser({
		config,
		eventTarget,
		tokenStorage,
		accountPopupLogin,
		decodeAccessToken,
		userPanels: selects<UserPanel>("user-panel"),
	})

	// setup the paywall
	if (userModel)
		await setupPaywall({
			config,
			handleNewAccessToken: userModel.handleNewAccessToken,
		})
}
