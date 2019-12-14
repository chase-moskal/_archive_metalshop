
import {LitElement, html} from "lit-element"

import {ProfileModel} from "../interfaces.js"
import {mixinAuth} from "../framework/mixin-auth.js"

export class UserAvatar extends (
	mixinAuth<ProfileModel, typeof LitElement>(
		LitElement
	)
) {

	render() {
		const {profile, premium = false} = this.model.reader.state
		return html`
			<avatar-display
				src=${profile && profile.public.picture}
				?premium=${premium}
			></avatar-display>
		`
	}
}
