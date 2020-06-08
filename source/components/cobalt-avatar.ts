
import {silhouette} from "../system/icons.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {Persona} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html, property, css, TemplateResult} from "../framework/metalshop-component.js"

const styles = css`

img, svg {
	display: block;
	width: var(--cobalt-avatar-size, 6em);
	height: var(--cobalt-avatar-size, 6em);
}

`

 @mixinStyles(styles)
export class CobaltAvatar extends MetalshopComponent<void> {

	@property({type: Object})
		fallbackAvatar: TemplateResult = silhouette

	@property({type: Object})
		persona?: Persona

	render() {
		const {persona} = this
		const avatar = persona?.profile?.avatar
		return html`
			${avatar
				? html`<img src=${avatar} alt="[avatar]"/>`
				: this.fallbackAvatar}
		`
	}
}
