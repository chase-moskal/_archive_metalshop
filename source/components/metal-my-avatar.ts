
import {ProfileModel} from "../interfaces.js"
import {LitElement, html, css} from "lit-element"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

const Component = mixinModelSubscription<ProfileModel, typeof LitElement>(
	LitElement
)

export class MetalMyAvatar extends Component {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {profile, premium = false} = this.model.reader.state
		const src = (profile && profile.avatar) || ""
		return html`
			<metal-avatar
				src=${src}
				?premium=${premium}
			></metal-avatar>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}
`
