
import {observable, action} from "mobx"
import {PaywallLiaisonTopic, User} from "authoritarian/dist/interfaces.js"
import {GetAuthContext, AuthUpdate, AuthMode, BillingStatus, PremiumStatus, TriggerCheckoutPopup} from "../interfaces.js"

export class PaywallModel {
	@observable autoRenew: boolean
	@observable billingStatus: BillingStatus
	@observable premiumStatus: PremiumStatus
	private getAuthContext: GetAuthContext
	private paywallLiaison: PaywallLiaisonTopic
	private triggerCheckoutPopup: TriggerCheckoutPopup

	constructor(options: {
		paywallLiaison: PaywallLiaisonTopic
		triggerCheckoutPopup: TriggerCheckoutPopup
	}) { Object.assign(this, options) }

	// //
	// // public methods
	// //

	@action.bound async handleAuthUpdate({
		user,
		mode: authMode,
		getAuthContext,
	}: AuthUpdate) {
		this.getAuthContext = getAuthContext
		
		// TODO something

		// this.setStatuses({
		// 	billingStatus: authMode === AuthMode.LoggedIn
		// 		? this.isBillingLinked(user)
		// 			? BillingStatus.Linked
		// 			: BillingStatus.Unlinked
		// 		: BillingStatus.Unlinked,
		// 	premiumStatus: authMode === AuthMode.LoggedIn
		// 		? this.isPremium(user)
		// 			? PremiumStatus.Premium
		// 			: PremiumStatus.NotPremium
		// 		: PremiumStatus.NotPremium,
		// 	autoRenew: authMode === AuthMode.LoggedIn
		// 		? this.isPremium(user)
		// 			? user.claims.premium.autoRenew
		// 			: false
		// 		: false,
		// })
	}

	// @action.bound async linkCard() {
	// 	const {accessToken} = await this.getAuthContext()
	// 	const {stripeSessionId} = await this.stripeLiaison.createSessionForLinking({
	// 		accessToken
	// 	})
	// 	await this.triggerPaywallPopup({stripeSessionId})
	// }

	// @action.bound async unlinkCard() {
	// 	const {accessToken} = await this.getAuthContext()
	// 	await this.stripeLiaison.unlink({accessToken})
	// }

	// @action.bound async premiumSubscribe() {
	// 	const {accessToken} = await this.getAuthContext()
	// 	const {stripeSessionId} = await this.stripeLiaison.createSessionForPremium({
	// 		accessToken
	// 	})
	// 	await this.triggerPaywallPopup({stripeSessionId})
	// }

	// @action.bound async premiumSetAutoRenew({autoRenew}: {autoRenew: boolean}) {
	// 	const {accessToken} = await this.getAuthContext()
	// 	await this.stripeLiaison.setPremiumAutoRenew({
	// 		autoRenew,
	// 		accessToken,
	// 	})
	// }

	// //
	// // private methods
	// //

	// private isPremium(user: User) {
	// 	const expires = user?.claims?.premium?.expires
	// 	return expires && (expires > Date.now())
	// }

	// private isBillingLinked(user: User) {
	// 	return !!user?.claims?.billing?.linked
	// }

	// @action private setStatuses({billingStatus, premiumStatus, autoRenew}: {
	// 		autoRenew: boolean
	// 		billingStatus: BillingStatus
	// 		premiumStatus: PremiumStatus
	// 	}) {
	// 	this.autoRenew = autoRenew
	// 	this.premiumStatus = premiumStatus
	// 	this.billingStatus = billingStatus
	// }
}
