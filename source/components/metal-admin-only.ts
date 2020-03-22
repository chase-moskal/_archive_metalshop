

import {html, css, LitElement, property} from "lit-element"

import {deepEqual} from "../toolbox/deep.js"
import {ProfileModel} from "../interfaces.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

const Component = mixinLoadable(
	mixinModelSubscription<ProfileModel, typeof LitElement>(
		LitElement
	)
)

export class MetalAdminOnly extends Component {
	static get styles() { return [super.styles || css``, styles] }
	errorMessage = "error in admin area"
	loadingMessage = "loading admin area"
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean

	firstUpdated() {
		this["initially-hidden"] = false
	}

	updated() {
		const {error, loading} = this.model.reader.state
		this.loadableState = error
			? LoadableState.Error
			: loading
				? LoadableState.Loading
				: LoadableState.Ready
	}

	renderReady() {
		const {admin} = this.model.reader.state
		return !admin ? null : html`
			<slot></slot>
		`
	}
}

const styles = css`
	:host {
		color: var(--metal-admin-color, #ff5c98);
	}
`
