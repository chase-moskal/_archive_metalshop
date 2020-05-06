
import {DetailsShare} from "../interfaces.js"
import {styles} from "./styles/details-styles.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, css} from "../framework/metalshop-component.js"

@mixinStyles(styles)
export class MetalSettings extends MetalshopComponent<DetailsShare> {
	render() {
		const {settingsLoad} = this.share
		return html`
			<div class="settings">
				<iron-loading .load=${settingsLoad}>
					<div>settings!</div>
					<metal-admin-mode>Admin mode</metal-admin-mode>
				</iron-loading>
			</div>
		`
	}
}
