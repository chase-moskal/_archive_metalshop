
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, property, css} from "../framework/metalshop-component.js"

import {User, Profile} from "authoritarian/dist/interfaces.js"

export type PersonaSaveProfile = (profile: Profile) => Promise<void>

export interface Persona {
	user: User
	profile: Profile
}

const styles = css`

`

@mixinStyles(styles)
export class CobaltPersona extends MetalshopComponent<void> {

	@property({type: Object})
		persona?: {user: User; profile: Profile}

	@property({type: Function})
		saveProfile: PersonaSaveProfile

	@property({type: Boolean, reflect: true})
		stack: boolean

	@property({type: Boolean})
		private busy: boolean = false

	render() {
		return html`

		`
	}
}
