
import {PaywallGuardianTopic} from "authoritarian/dist/interfaces.js"

import {pubsub, pubsubs} from "../toolbox/pubsub.js"
import {makeReader} from "../toolbox/make-reader.js"

import {
	PaywallModel,
	PaywallState,
	PaywallEvents,
	GetAuthContext,
	LoginWithAccessToken,
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

	let getAuthContext: GetAuthContext
	const state: PaywallState = {
		mode: PaywallMode.LoggedOut
	}

	const {reader, publishStateUpdate} = makeReader<PaywallState>(state)
	const {publishers, subscribers} = pubsubs<PaywallEvents>({
		loginWithAccessToken: pubsub<LoginWithAccessToken>(),
	})

	// TODO paypal
	const paypalToken = `paypal-lol-fake-token`

	return {
		reader,
		actions: {
			async makeUserPremium() {
				state.mode = PaywallMode.Loading
				publishStateUpdate()
				const {accessToken} = await getAuthContext()
				const newAccessToken = await paywallGuardian.grantUserPremium({
					paypalToken,
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
					paypalToken,
					accessToken
				})
				await publishers.loginWithAccessToken(newAccessToken)
				publishStateUpdate()
			}
		},
		wiring: {
			publishStateUpdate,
			loginWithAccessToken: subscribers.loginWithAccessToken,
			async receiveUserLogin(options) {
				state.mode = PaywallMode.Loading
				getAuthContext = options.getAuthContext
				publishStateUpdate()
				const context = await getAuthContext()
				const premium = !!context.user.public.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
				publishStateUpdate()
			},
			async receiveUserLogout() {
				state.mode = PaywallMode.LoggedOut
				publishStateUpdate()
			}
		}
	}
}
