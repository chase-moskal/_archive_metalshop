
import {ProfileModel} from "../interfaces.js"
import {LitElement, html, css} from "lit-element"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

const Component = mixinModelSubscription<ProfileModel, typeof LitElement>(
	LitElement
)

export class UserAvatar extends Component {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {profile, premium = false} = this.model.reader.state
		const src = (profile && profile.avatar) || ""
		return html`
			<avatar-display
				src=${src}
				?premium=${premium}
			></avatar-display>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}
`
