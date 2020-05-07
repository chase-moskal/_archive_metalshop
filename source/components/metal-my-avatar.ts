
import {MyAvatarShare} from "../interfaces.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, css} from "../framework/metalshop-component.js"

@mixinStyles(css`
	:host {
		display: block;
	}
`)
export class MetalMyAvatar extends MetalshopComponent<MyAvatarShare> {
	render() {
		const {profile, premium} = this.share
		const avatar = profile?.avatar || ""
		return html`
			<metal-avatar src=${avatar} ?premium=${premium}></metal-avatar>
		`
	}
}
