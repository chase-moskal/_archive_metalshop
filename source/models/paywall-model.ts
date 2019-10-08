
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

	const {pub, sub} = pubsubs<PaywallEvents>({
		stateUpdate: pubsub(),
		loginWithAccessToken: pubsub(),
	})

	return {
		reader: makeReader<PaywallState>({
			state,
			subscribe: sub.stateUpdate
		}),

		actions: {
			async makeUserPremium() {
				state.mode = PaywallMode.Loading
				pub.stateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.makeUserPremium({
					accessToken
				})
				await pub.loginWithAccessToken(newAccessToken)
				pub.stateUpdate()
			},

			async revokeUserPremium() {
				state.mode = PaywallMode.Loading
				pub.stateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.revokeUserPremium({
					accessToken
				})
				await pub.loginWithAccessToken(newAccessToken)
				pub.stateUpdate()
			},
		},

		wiring: {
			loginWithAccessToken: sub.loginWithAccessToken,

			async notifyUserLogin(options) {
				state.mode = PaywallMode.Loading
				getAuthContext = options.getAuthContext
				pub.stateUpdate()
				const context = await getAuthContext()
				const premium = !!context.user.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
				pub.stateUpdate()
			},

			async notifyUserLogout() {
				state.mode = PaywallMode.LoggedOut
				pub.stateUpdate()
			},
		},
	}
}
