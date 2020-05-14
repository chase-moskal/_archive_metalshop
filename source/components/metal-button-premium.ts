
import * as loading from "../toolbox/loading.js"
import {ButtonPremiumShare} from "../interfaces.js"
import {MetalshopComponent, html} from "../framework/metalshop-component.js"

export class MetalButtonPremium extends MetalshopComponent<ButtonPremiumShare> {

	onSubscribeClick = async() => {
		const loggedIn = !!loading.payload(this.share.authLoad)?.user
		console.log({loggedIn})
		if (!loggedIn) await this.share.login()
		if (!this.share.premiumSubscription) await this.share.checkoutPremium()
		else console.log("WHOOPS, already premium!")
	}

	render() {
		return html`
			<metal-is-premium class="coolbuttonarea">
				<span>You are premium</span>
				<button slot="not" @click=${this.onSubscribeClick}>
					Subscribe Premium
				</button>
			</metal-is-premium>
		`
	}
}
