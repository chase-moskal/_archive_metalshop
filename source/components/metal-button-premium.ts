
import {nap} from "../toolbox/nap.js"
import * as loading from "../toolbox/loading.js"
import {ButtonPremiumShare} from "../interfaces.js"
import {MetalshopComponent, html} from "../framework/metalshop-component.js"

export class MetalButtonPremium extends MetalshopComponent<ButtonPremiumShare> {

	onSubscribeClick = async() => {
		const loggedIn = !!(loading.payload(this.share.personalLoad)?.user)
		if (!loggedIn) await this.share.login()

		// TODO replace with.. login awaiting its side effects?
		await nap(2000)

		if (!this.share.premiumSubscription) {
			console.log("CHECKOUT PREMIUM")
			await this.share.checkoutPremium()
		}
		else console.log("ALREADY PREMIUM")
	}

	render() {
		const {personalLoad, premiumSubscription} = this.share
		return html`
			<iron-loading .load=${personalLoad} class="coolbuttonarea">
				${premiumSubscription ? null : html`
					<button @click=${this.onSubscribeClick}>
						Subscribe Premium
					</button>
				`}
			</iron-loading>
		`
	}
}
