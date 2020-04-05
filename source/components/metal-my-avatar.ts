
import {PaywallMode, MyAvatarShare} from "../interfaces.js"
import {MetalshopComponent, html, css} from "../framework/metalshop-component.js"

export class MetalMyAvatar extends MetalshopComponent<MyAvatarShare> {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {profile, paywallMode} = this.share
		const src = profile?.avatar || ""
		return html`
			<metal-avatar
				src=${src}
				?premium=${paywallMode === PaywallMode.Premium}
			></metal-avatar>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}
`
