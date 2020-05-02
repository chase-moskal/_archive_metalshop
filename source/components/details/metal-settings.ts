
import {styles} from "./details-styles.js"
import {litLoading} from "../iron-loading.js"
import {DetailsShare} from "../../interfaces.js"
import {Settings} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html, css} from "../../framework/metalshop-component.js"

export class MetalSettings extends MetalshopComponent<DetailsShare> {
	static get styles() { return [super.styles || css``, styles] }

	private renderSettings = (settings: Settings) => html`
		<div>settings!</div>
	`

	render() {
		const {renderSettings} = this
		const {settingsLoad} = this.share
		return html`
			<div class="settings">
				${litLoading(settingsLoad, renderSettings)}
			</div>
		`
	}
}
