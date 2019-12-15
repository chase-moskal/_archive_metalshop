
import {LitElement, html, css} from "lit-element"
import {ProfileModel} from "../interfaces.js"
import {mixinAuth} from "../framework/mixin-auth.js"

export class UserAvatar extends (
	mixinAuth<ProfileModel, typeof LitElement>(
		LitElement
	)
) {

	render() {
		const {profile, premium = false} = this.model.reader.state
		const src = (profile && profile.public.picture) || ""
		return html`
			<avatar-display
				src=${src}
				?premium=${premium}
			></avatar-display>
		`
	}
}
