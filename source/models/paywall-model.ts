
import {PaywallGuardianTopic} from "authoritarian/dist/interfaces.js"

import {pubsub, makeReader} from "../toolbox/pubsub.js"

import {
	UserState,
	PaywallModel,
	PaywallState,
	GetAuthContext,
	LoginWithAccessToken,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

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

	const {reader, update} = makeReader<PaywallState>(state)

	const {
		publish: publishLoginWithAccessToken,
		subscribe: subscribeLoginWithAccessToken,
	} = pubsub<LoginWithAccessToken>()

	// TODO paypal
	const paypalToken = `paypal-lol-fake-token`

	return {
		reader,
		update,
		subscribeLoginWithAccessToken,
		async makeUserPremium() {
			state.mode = PaywallMode.Loading
			update()
			const {accessToken} = await getAuthContext()
			const newAccessToken = await paywallGuardian.grantUserPremium({
				paypalToken,
				accessToken
			})
			await publishLoginWithAccessToken(newAccessToken)
			update()
		},
		async revokeUserPremium() {
			state.mode = PaywallMode.Loading
			update()
			const {accessToken} = await getAuthContext()
			const newAccessToken = await paywallGuardian.revokeUserPremium({
				paypalToken,
				accessToken
			})
			await publishLoginWithAccessToken(newAccessToken)
			update()
		},
		async receiveUserUpdate({mode, getAuthContext: getContext}: UserState) {
			getAuthContext = getContext
			if (mode === UserMode.LoggedIn) {
				state.mode = PaywallMode.Loading
				update()
				const context = await getAuthContext()
				const premium = !!context.user.public.claims.premium
				state.mode = premium
					? PaywallMode.Premium
					: PaywallMode.NotPremium
			}
			else {
				state.mode = PaywallMode.LoggedOut
			}
			update()
		},
	}
}
