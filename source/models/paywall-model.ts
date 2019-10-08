
import {
	PaywallGuardianTopic
} from "authoritarian/dist/interfaces.js"

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

	const {publishers, subscribers} = pubsubs<PaywallEvents>({
		stateUpdate: pubsub(),
		loginWithAccessToken: pubsub(),
	})

	return {
		reader: makeReader<PaywallState>({
			state,
			subscribe: subscribers.stateUpdate
		}),

		actions: {
			async makeUserPremium() {
				state.mode = PaywallMode.Loading
				publishers.stateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.makeUserPremium({
					accessToken
				})
				await publishers.loginWithAccessToken(newAccessToken)
				publishers.stateUpdate()
			},

			async revokeUserPremium() {
				state.mode = PaywallMode.Loading
				publishers.stateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.revokeUserPremium({
					accessToken
				})
				await publishers.loginWithAccessToken(newAccessToken)
				publishers.stateUpdate()
			},
		},

		wiring: {
			loginWithAccessToken: subscribers.loginWithAccessToken,

			async notifyUserLogin(options) {
				state.mode = PaywallMode.Loading
				getAuthContext = options.getAuthContext
				publishers.stateUpdate()
				const context = await getAuthContext()
				const premium = !!context.user.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
				publishers.stateUpdate()
			},

			async notifyUserLogout() {
				state.mode = PaywallMode.LoggedOut
				publishers.stateUpdate()
			}
		}
	}
}
