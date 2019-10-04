
import {LitElement} from "lit-element"
import {AccessToken, PaywallGuardianTopic} from "authoritarian/dist/interfaces.js"

import {selects} from "../toolbox/selects.js"
import {createEventListener} from "../toolbox/create-event-listener.js"

import {PaywallPanel} from "../components/paywall-panel.js"
import {GetAuthContext} from "../interfaces.js"

export enum PaywallMode {
	Loading,
	Error,
	LoggedOut,
	NotPremium,
	Premium,
}

export interface PaywallState {
	mode: PaywallMode
}

export interface PaywallPanelAccess {
	state: PaywallState
	actions: {
		makeUserPremium: () => Promise<void>
		revokeUserPremium: () => Promise<void>
	}
}

export interface PaywallAppAccess {
	actions: {
		notifyUserLogin: (o: {getAuthContext: GetAuthContext}) => Promise<void>
		notifyUserLogout: () => Promise<void>
	}
}

export function createPaywallModel({
	paywallGuardian,
	paywallPanels = selects("paywall-panel"),
	handleNewAccessToken = () => {}
}: {
	paywallGuardian: PaywallGuardianTopic,
	paywallPanels?: PaywallPanel[],
	handleNewAccessToken?: (accessToken: AccessToken) => void
}) {
	const secrets: {getAuthContext: GetAuthContext} = {
		getAuthContext: null
	}

	const state: PaywallState = {
		mode: PaywallMode.LoggedOut
	}

	function updateComponents() {
		for (const panel of paywallPanels)
			panel.requestUpdate()
	}

	const action = (func: Function) => async(...args: any) => {
		await func(...args)
		updateComponents()
	}

	const componentAccess: PaywallPanelAccess = {
		get state() {return state},
		actions: {
			makeUserPremium: action(async() => {
				state.mode = PaywallMode.Loading
				updateComponents()
				const {accessToken} = await secrets.getAuthContext()
				const newAccessToken = await paywallGuardian.makeUserPremium({accessToken})
				handleNewAccessToken(newAccessToken)
			}),
			revokeUserPremium: action(async() => {
				state.mode = PaywallMode.Loading
				updateComponents()
				const {accessToken} = await secrets.getAuthContext()
				const newAccessToken = await paywallGuardian.revokeUserPremium({accessToken})
				handleNewAccessToken(newAccessToken)
			}),
		}
	}

	for (const panel of paywallPanels)
		panel.access = componentAccess

	const appAccess: PaywallAppAccess = {
		actions: {
			notifyUserLogin: action(async({getAuthContext}) => {
				state.mode = PaywallMode.Loading
				secrets.getAuthContext = getAuthContext
				updateComponents()
				const context = await getAuthContext()
				const premium = !!context.user.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
			}),
			notifyUserLogout: action(async () => {
				state.mode = PaywallMode.LoggedOut
			}),
		}
	}

	return appAccess
}
