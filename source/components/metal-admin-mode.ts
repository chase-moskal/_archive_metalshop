
import {deepEqual} from "../toolbox/deep.js"
import {mixinShare} from "../framework/share.js"
import {ProfileShare, ProfileMode} from "../interfaces.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {MobxLitElement, property, html, css} from "../framework/mobx-lit-element.js"

const Component = mixinLoadable(
	mixinShare<ProfileShare, typeof MobxLitElement>(
		MobxLitElement
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
		const {mode} = this.share
		const loadingState = (mode: LoadableState) => this.loadableState = mode
		switch (mode) {
			case ProfileMode.Error:
				loadingState(LoadableState.Error)
				break
			case ProfileMode.Loading:
				loadingState(LoadableState.Loading)
				break
			case ProfileMode.None:
			case ProfileMode.Loaded:
				loadingState(LoadableState.Ready)
				break
			default:
				loadingState(LoadableState.Error)
		}
	}

	private _handleAdminModeChange = (event: InputEvent) => {
		const adminMode = !!(<HTMLInputElement>event.currentTarget).checked
		const {profile} = this.share
		if (!profile) return
		const newProfile = {...profile, adminMode}
		const changes = !deepEqual(profile, newProfile)

		// save the new profile with admin mode
		if (changes) this.share.saveProfile(newProfile)
	}

	renderReady() {
		const {user, profile} = this.share
		const adminClaim = user?.claims?.admin

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
		color: var(--metal-admin-color, #fd34e2);
	}
`
