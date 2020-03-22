
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

export class MetalAdminMode extends Component {
	static get styles() { return [super.styles || css``, styles] }
	errorMessage = "error in admin controls"
	loadingMessage = "loading admin controls"
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

	private _handleAdminModeChange = (event: InputEvent) => {
		const adminMode = !!(<HTMLInputElement>event.currentTarget).checked
		const {profile} = this.model.reader.state
		if (!profile) return
		const newProfile = {...profile, adminMode}
		const changes = !deepEqual(profile, newProfile)

		// save the new profile with admin mode
		if (changes) this.model.saveProfile(newProfile)
	}

	renderReady() {
		const {adminClaim, profile} = this.model.reader.state
		return !profile || !adminClaim ? null : html`
			<input
				type="checkbox"
				?checked=${profile.adminMode}
				@change=${this._handleAdminModeChange}
				@keyup=${this._handleAdminModeChange}
				/>
			<label><slot>Admin mode</slot></label>
		`
	}
}

const styles = css`
	:host {
		color: var(--metal-admin-color, #ff5c98);
	}
`
