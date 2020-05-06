
import {PaywallShare} from "../interfaces.js"
import {star as starIcon} from "../system/icons.js"
import {styles} from "./styles/metal-paywall-styles.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html} from "../framework/metalshop-component.js"

@mixinStyles(styles)
export class MetalPaywall extends MetalshopComponent<PaywallShare> {

	render() {
		return html`
			<iron-loading>
				temp
			</iron-loading>
		`
	}

	// static get styles() { return [super.styles || css``, styles] }
	// loadingMessage = "loading supporter panel"

	// updated() {
	// 	const {mode} = this.share
	// 	switch (mode) {
	// 		case PaywallMode.Loading:
	// 			this.loadableState = LoadableState.Loading
	// 			break
	// 		case PaywallMode.Error:
	// 			this.loadableState = LoadableState.Error
	// 			break
	// 		default:
	// 			this.loadableState = LoadableState.Ready
	// 	}
	// }

	// private _renderNotPremium() {return html`
	// 	<header>
	// 		<h3>Become a premium supporter!</h3>
	// 	</header>
	// 	<section>
	// 		<p>It comes with cool features!</p>
	// 	</section>
	// 	<footer class="coolbuttonarea">
	// 		<button @click=${this.share.grantUserPremium}>Subscribe</button>
	// 		<span class="price">$5<small>/month</small></span>
	// 	</footer>
	// `}

	// private _renderPremium() {return html`
	// 	<header>
	// 		<div class="icon">${star}</div>
	// 		<h3>You are a premium supporter!</h3>
	// 	</header>
	// 	<section>
	// 		<p>You have the cool features!</p>
	// 	</section>
	// 	<footer class="coolbuttonarea">
	// 		<button @click=${this.share.revokeUserPremium}>Unsubscribe</button>
	// 		<span class="note">You are currently subscribed</span>
	// 	</footer>
	// `}

	// renderReady() {
	// 	const {mode} = this.share
	// 	if (mode === undefined) return null
	// 	switch (mode) {
	// 		case PaywallMode.LoggedOut: return null
	// 		case PaywallMode.NotPremium: return this._renderNotPremium()
	// 		case PaywallMode.Premium: return this._renderPremium()
	// 	}
	// }
}
