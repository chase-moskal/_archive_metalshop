
import {DetailsShare} from "../interfaces.js"
import {styles} from "./styles/details-styles.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, property} from "../framework/metalshop-component.js"

 @mixinStyles(styles)
export class MetalSettings extends MetalshopComponent<DetailsShare> {

	 @property({type: Boolean, reflect: true})
	["hidden"]: boolean = true

	autorun() {
		const {user} = this.share
		const adminClaim = !!user?.claims.admin
		this["hidden"] = !adminClaim
	}

	render() {
		const {settingsLoad} = this.share
		return html`
			<div class="settings">
				<iron-loading .load=${settingsLoad}>
					<metal-admin-mode>Admin mode</metal-admin-mode>
				</iron-loading>
			</div>
		`
	}
}
