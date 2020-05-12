
import {AccountShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {MetalshopComponent, html, property} from "../framework/metalshop-component.js"

export class MetalIsPremium extends MetalshopComponent<AccountShare> {
	@property({type: Boolean, reflect: true}) ["loaded"]: boolean
	@property({type: Boolean, reflect: true}) ["premium"]: boolean

	autorun() {
		const {authLoad} = this.share
		const authPayload = loading.payload(authLoad)
		this["loaded"] = !!authPayload
		this["premium"] = !!authPayload?.user?.claims.premium
	}

	render() {
		const {authLoad} = this.share
		return html`
			<iron-loading .load=${authLoad}>
				${this["premium"]
					? html`<slot></slot>`
					: html`<slot name="not"></slot>`}
			</iron-loading>
		`
	}
}
