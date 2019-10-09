
import {PaywallGuardianTopic} from "authoritarian/dist/interfaces.js"

import {pubsub, pubsubs} from "../toolbox/pubsub.js"
import {makeReader} from "../toolbox/make-reader.js"

import {
	PaywallModel,
	PaywallState,
	PaywallEvents,
	GetAuthContext,
} from "../system/interfaces.js"

export enum PaywallMode {
	Loading,
	Error,
	LoggedOut,
	NotPremium,
	Premium,
}

export function createPaywallModel({paywallGuardian}: {
	paywallGuardian: PaywallGuardianTopic
}): PaywallModel {

	let getAuthContext: GetAuthContext = null

	const state: PaywallState = {
		mode: PaywallMode.LoggedOut
	}

	const reader = makeReader<PaywallState>(state)
	const {publishStateUpdate} = reader
	const {publishers, subscribers} = pubsubs<PaywallEvents>({
		loginWithAccessToken: pubsub(),
	})

	return {
		reader,
		actions: {
			async makeUserPremium() {
				state.mode = PaywallMode.Loading
				publishStateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.makeUserPremium({
					accessToken
				})
				await publishers.loginWithAccessToken(newAccessToken)
				publishStateUpdate()
			},
			async revokeUserPremium() {
				state.mode = PaywallMode.Loading
				publishStateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.revokeUserPremium({
					accessToken
				})
				await publishers.loginWithAccessToken(newAccessToken)
				publishStateUpdate()
			}
		},
		wiring: {
			loginWithAccessToken: subscribers.loginWithAccessToken,
			async notifyUserLogin(options) {
				state.mode = PaywallMode.Loading
				getAuthContext = options.getAuthContext
				publishStateUpdate()
				const context = await getAuthContext()
				const premium = !!context.user.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
				publishStateUpdate()
			},
			async notifyUserLogout() {
				state.mode = PaywallMode.LoggedOut
				publishStateUpdate()
			}
		}
	}
}
