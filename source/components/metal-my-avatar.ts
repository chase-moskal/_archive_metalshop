
import {WithShare} from "../framework/share.js"
import {PaywallMode, MyAvatarShare} from "../interfaces.js"
import {MobxLitElement, html, css} from "../framework/mobx-lit-element.js"

const Component = <WithShare<MyAvatarShare, typeof MobxLitElement>>
	MobxLitElement

export class MetalMyAvatar extends Component {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {profile, paywallMode} = this.share
		const src = profile?.avatar || ""
		return html`
			<metal-avatar
				src=${src}
				?premium=${paywallMode === PaywallMode.Premium}
			></metal-avatar>
		`
	}
}

const styles = css`
	:host {
		display: block;
	}
`
