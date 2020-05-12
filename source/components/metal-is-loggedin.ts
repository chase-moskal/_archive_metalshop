
import {AccountShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {MetalshopComponent, html, property} from "../framework/metalshop-component.js"

export class MetalIsLoggedin extends MetalshopComponent<AccountShare> {
	@property({type: Boolean, reflect: true}) ["loaded"]: boolean
	@property({type: Boolean, reflect: true}) ["loggedin"]: boolean

	autorun() {
		const {authLoad} = this.share
		const authPayload = loading.payload(authLoad)
		this["loaded"] = !!authPayload
		this["loggedin"] = !!authPayload?.user
	}

	render() {
		const {authLoad} = this.share
		return html`
			<iron-loading .load=${authLoad}>
				${this["loggedin"]
					? html`<slot></slot>`
					: html`<slot name="not"></slot>`}
			</iron-loading>
		`
	}
}
