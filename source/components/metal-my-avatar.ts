
import {mixinShare} from "../framework/share.js"
import {PaywallShare, PaywallMode} from "../interfaces.js"
import {MobxLitElement, html, css} from "../framework/mobx-lit-element.js"

const Component = mixinShare<PaywallShare, typeof MobxLitElement>(
	MobxLitElement
)

export class MetalMyAvatar extends Component {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {profile, mode} = this.share
		const src = profile?.avatar || ""
		return html`
			<metal-avatar
				src=${src}
				?premium=${mode === PaywallMode.Premium}
			></metal-avatar>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}
`
