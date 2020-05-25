
import {action, computed} from "mobx"
import {PaywallLiaisonTopic} from "authoritarian/dist/interfaces.js"

import {AuthModel} from "./auth-model.js"
import {PersonalModel} from "./personal-model.js"
import {TriggerCheckoutPopup} from "../interfaces.js"

export class PaywallModel {
	private readonly auth: AuthModel
	private readonly personal: PersonalModel
	private readonly checkoutPopupUrl: string
	private readonly paywallLiaison: PaywallLiaisonTopic
	private readonly triggerCheckoutPopup: TriggerCheckoutPopup

	constructor(options: {
			auth: AuthModel
			personal: PersonalModel
			checkoutPopupUrl: string
			paywallLiaison: PaywallLiaisonTopic
			triggerCheckoutPopup: TriggerCheckoutPopup
		}) {
		Object.assign(this, options)
	}

	 @computed
	get premiumClaim(): boolean {
		return !!this.auth.user?.claims?.premium
	}

	 @computed
	get premiumExpires(): number {
		return this.personal.settings?.premium?.expires
	}

	 @computed
	get premiumSubscription() {
		return this.personal.settings?.billing?.premiumSubscription
	}

	 @action.bound
	async checkoutPremium() {
		const {accessToken} = await this.auth.getAuthContext()
		const {stripeSessionId} = await this.paywallLiaison.checkoutPremium({
			accessToken,
			popupUrl: this.checkoutPopupUrl,
		})
		await this.triggerCheckoutPopup({stripeSessionId})
		await this.auth.reauthorize()
	}

	 @action.bound
	async updatePremium() {
		const {accessToken} = await this.auth.getAuthContext()
		const {stripeSessionId} = await this.paywallLiaison.updatePremium({
			accessToken,
			popupUrl: this.checkoutPopupUrl,
		})
		await this.triggerCheckoutPopup({stripeSessionId})
		await this.auth.reauthorize()
	}

	 @action.bound
	async cancelPremium() {
		const {accessToken} = await this.auth.getAuthContext()
		await this.paywallLiaison.cancelPremium({accessToken})
		await this.auth.reauthorize()
	}
}
