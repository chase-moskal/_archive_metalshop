
import {PremiumStatus, MyAvatarShare} from "../interfaces.js"
import {MetalshopComponent, html, css} from "../framework/metalshop-component.js"

export class MetalMyAvatar extends MetalshopComponent<MyAvatarShare> {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {profile, premiumStatus} = this.share
		const avatar = profile?.avatar || ""
		const premium: boolean = premiumStatus == PremiumStatus.Premium
		return html`
			<metal-avatar src=${avatar} ?premium=${premium}></metal-avatar>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}
`
