
import {silhouette} from "../system/icons.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {User, Profile} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html, property, css, TemplateResult} from "../framework/metalshop-component.js"

export type PersonaSaveProfile = (profile: Profile) => Promise<void>

export interface Persona {
	user: User
	profile: Profile
}

const styles = css`

:host {
	display: block;
	width: var(--cobalt-persona-avatar-size, 6em);
	height: var(--cobalt-persona-avatar-size, 6em);
}

:host > * {
	display: block;
	width: 100%;
	height: 100%;
}

img, svg {
	display: block;
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
