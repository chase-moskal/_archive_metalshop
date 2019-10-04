
import {PaywallGuardianTopic, AccessToken} from "authoritarian/dist/interfaces.js"

import {selects, select} from "../toolbox/selects.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {createPaywallModel} from "../models/paywall-model.js"
import {createEventListener} from "../toolbox/create-event-listener.js"

import {UserLoginEvent, UserLogoutEvent, UserErrorEvent} from "../events.js"

export async function setupPaywall({
	config, paywallGuardian, handleNewAccessToken, paywallPanels,
}: {
	config: Element
	paywallPanels: PaywallPanel[]
	paywallGuardian: PaywallGuardianTopic
	handleNewAccessToken: (accessToken: AccessToken) => Promise<void>
}) {
	const paywallModelConfig = select("paywall-model", config)
	if (!paywallModelConfig) return
	// const paywallGuardianUrl = paywallModelConfig.getAttribute("url")
	const model = createPaywallModel({
		paywallGuardian,
		onStateUpdate: () => {
			for (const panel of paywallPanels)
				panel.requestUpdate()
		},
		handleNewAccessToken
	})

	// give each panel the component access object
	for (const panel of paywallPanels)
		panel.access = model.componentAccess

	// wiring user events to app access actions
	createEventListener(UserLoginEvent, window, {}, event => {
		const {getAuthContext} = event.detail
		model.appAccess.actions.notifyUserLogin({getAuthContext})
	})
	createEventListener(UserLogoutEvent, window, {}, () => {
		model.appAccess.actions.notifyUserLogout()
	})
	createEventListener(UserErrorEvent, window, {}, () => {
		model.appAccess.actions.notifyUserLogout()
	})

	return model
}
