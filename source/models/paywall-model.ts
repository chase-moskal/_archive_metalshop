
import {AccessToken, PaywallGuardianTopic} from "authoritarian/dist/interfaces.js"

import {
	PaywallState,
	GetAuthContext,
	PaywallAppAccess,
	PaywallPanelAccess,
} from "../interfaces.js"

export enum PaywallMode {
	Loading,
	Error,
	LoggedOut,
	NotPremium,
	Premium,
}

export function createPaywallModel({
	paywallGuardian,
	onStateUpdate = () => {},
	handleNewAccessToken = async() => {}
}: {
	paywallGuardian: PaywallGuardianTopic,
	onStateUpdate?: () => void
	handleNewAccessToken?: (accessToken: AccessToken) => Promise<void>
}) {

	//
	// local private state
	//

	let getAuthContext: GetAuthContext = null

	const state: PaywallState = {
		mode: PaywallMode.LoggedOut
	}

	//
	// component access object
	// has state and actions that the components may use
	//

	const componentAccess: PaywallPanelAccess = {
		get state() {return state},
		actions: {
			async makeUserPremium() {
				state.mode = PaywallMode.Loading
				onStateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.makeUserPremium({accessToken})
				await handleNewAccessToken(newAccessToken)
				onStateUpdate()
			},
			async revokeUserPremium() {
				state.mode = PaywallMode.Loading
				onStateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.revokeUserPremium({accessToken})
				await handleNewAccessToken(newAccessToken)
				onStateUpdate()
			},
		}
	}

	//
	// app access object
	// state and actions that the app can use
	//

	const appAccess: PaywallAppAccess = {
		actions: {
			async notifyUserLogin(options) {
				state.mode = PaywallMode.Loading
				getAuthContext = options.getAuthContext
				onStateUpdate()
				const context = await getAuthContext()
				const premium = !!context.user.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
				onStateUpdate()
			},
			async notifyUserLogout() {
				state.mode = PaywallMode.LoggedOut
				onStateUpdate()
			},
		}
	}

	return {appAccess, componentAccess}
}
