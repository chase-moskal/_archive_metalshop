
import {observable, action} from "mobx"
import {PaywallMode, GetAuthContext, AuthUpdate, AuthMode} from "../interfaces.js"
import {PaywallGuardianTopic, AccessToken} from "authoritarian/dist/interfaces.js"

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

	@action.bound async makeUserPremium() {
		this.setMode(PaywallMode.Loading)
		const {accessToken} = await this.getAuthContext()
		const newAccessToken = await this.paywallGuardian.grantUserPremium({
			accessToken,
			paypalToken: fakePaypalToken,
		})
		this.setNewAccessToken(newAccessToken)
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
