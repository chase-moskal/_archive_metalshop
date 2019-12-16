
import {ProfileModel} from "../interfaces.js"
import {LitElement, html} from "lit-element"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

export class UserAvatar extends
	mixinModelSubscription<ProfileModel, typeof LitElement>(
		LitElement
	)
{

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
