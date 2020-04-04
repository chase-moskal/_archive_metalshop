
import {LitElement, html, css} from "lit-element"

import {PaywallShare, PaywallMode} from "../interfaces.js"
import {mixinShare} from "../framework/share.js"

const Component = mixinShare<PaywallShare, typeof LitElement>(
	LitElement
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
