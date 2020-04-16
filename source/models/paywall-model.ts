
import {observable, action} from "mobx"
import {PaywallGuardianTopic, AccessToken} from "authoritarian/dist/interfaces.js"
import {PaywallMode, GetAuthContext, AuthUpdate, AuthMode} from "../interfaces.js"

import {openPaywallPopup} from "authoritarian/dist/business/paywall-popup/open-paywall-popup.js"
import {PaywallPopupParameters, PaywallPopupPayload} from "authoritarian/dist/business/paywall-popup/interfaces.js"

const fakePaypalToken = "fake-paypal-token"

export class PaywallModel {
	@observable mode: PaywallMode
	@observable newAccessToken: AccessToken
	private getAuthContext: GetAuthContext
	private paywallGuardian: PaywallGuardianTopic

	constructor(options: {
		paywallGuardian: PaywallGuardianTopic
	}) { Object.assign(this, options) }

	@action.bound async handleAuthUpdate({
		user,
		mode: authMode,
		getAuthContext,
	}: AuthUpdate) {
		this.getAuthContext = getAuthContext
		let paywallMode: PaywallMode = PaywallMode.LoggedOut
		if (authMode === AuthMode.LoggedIn) {
			this.setMode(PaywallMode.Loading)
			paywallMode = !!user.claims.premium
				? PaywallMode.Premium
				: PaywallMode.NotPremium
		}
		else {
			paywallMode = PaywallMode.LoggedOut
		}
		this.setMode(paywallMode)
	}

	@action.bound async grantUserPremium() {
		const {user} = await this.getAuthContext()
		const {userId} = user
		const stripePlanId = "plan_H5oUIjw9895qDj"

		const {promisedPayload} = openPaywallPopup({
			userId,
			stripePlanId,
			paywallServerOrigin: "http://paywall.metaldev.chasemoskal.com:8003",
		})

		const payload = await promisedPayload
		console.log("WE GOTS LE PAYLOAD!", payload)

		// this.setMode(PaywallMode.Loading)
		// const {accessToken} = await this.getAuthContext()
		// const newAccessToken = await this.paywallGuardian.grantUserPremium({
		// 	accessToken,
		// 	paypalToken: fakePaypalToken,
		// })
		// this.setNewAccessToken(newAccessToken)
	}

	@action.bound async revokeUserPremium() {
		this.setMode(PaywallMode.Loading)
		const {accessToken} = await this.getAuthContext()
		const newAccessToken = await this.paywallGuardian.revokeUserPremium({
			accessToken,
			paypalToken: fakePaypalToken,
		})
		this.setNewAccessToken(newAccessToken)
	}

	@action.bound private setMode(mode: PaywallMode) {
		this.mode = mode
	}

	@action.bound private setNewAccessToken(accessToken: AccessToken) {
		this.newAccessToken = accessToken
	}
}
