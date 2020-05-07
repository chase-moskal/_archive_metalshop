
import {observable, action, computed} from "mobx"
import {PaywallLiaisonTopic} from "authoritarian/dist/interfaces.js"
import {TriggerCheckoutPopup} from "../interfaces.js"

import {AuthModel} from "./auth-model.js"
import {DetailsModel} from "./details-model.js"

export class PaywallModel {
	@observable private readonly auth: AuthModel
	@observable private readonly details: DetailsModel
	private readonly checkoutPopupUrl: string
	private readonly paywallLiaison: PaywallLiaisonTopic
	private readonly triggerCheckoutPopup: TriggerCheckoutPopup

	constructor(options: {
			auth: AuthModel
			details: DetailsModel
			checkoutPopupUrl: string
			paywallLiaison: PaywallLiaisonTopic
			triggerCheckoutPopup: TriggerCheckoutPopup
		}) {
		Object.assign(this, options)
	}

	@computed get premium(): boolean {
		return !!this.auth?.user?.claims?.premium
	}

	@computed get billingPremiumSubscription() {
		return this.details?.settings?.billing?.premiumSubscription
	}

	@action.bound async checkoutPremium() {
		const {accessToken} = await this.auth.getAuthContext()
		const {stripeSessionId} = await this.paywallLiaison.checkoutPremium({
			accessToken,
			popupUrl: this.checkoutPopupUrl,
		})
		await this.triggerCheckoutPopup({stripeSessionId})
		await this.auth.reauthorize()
	}

	@action.bound async updatePremium() {
		const {accessToken} = await this.auth.getAuthContext()
		const {stripeSessionId} = await this.paywallLiaison.updatePremium({
			accessToken,
			popupUrl: this.checkoutPopupUrl,
		})
		await this.triggerCheckoutPopup({stripeSessionId})
		await this.auth.reauthorize()
	}

	@action.bound async cancelPremium() {
		const {accessToken} = await this.auth.getAuthContext()
		await this.paywallLiaison.cancelPremium({accessToken})
		await this.auth.reauthorize()
	}
}
