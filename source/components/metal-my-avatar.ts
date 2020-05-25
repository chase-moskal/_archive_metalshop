
import {MyAvatarShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, css} from "../framework/metalshop-component.js"

@mixinStyles(css`
	:host {
		display: block;
	}
	:host([hidden]) {
		display: none;
	}
	cobalt-avatar {
		--cobalt-avatar-size: 3em;
	}
`)
export class MetalMyAvatar extends MetalshopComponent<MyAvatarShare> {
	render() {
		const {personalLoad} = this.share
		const personal = loading.payload(personalLoad)
		return html`
			<cobalt-avatar .persona=${personal}></cobalt-avatar>
		`
	}
}
