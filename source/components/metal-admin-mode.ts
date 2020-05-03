
import * as loading from "../toolbox/loading.js"
import {deepEqual, deepClone} from "../toolbox/deep.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {AdminModeShare, ProfileMode, ConstructorFor} from "../interfaces.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

const Component: ConstructorFor<MetalshopComponent<AdminModeShare>> =
	MetalshopComponent

export class MetalAdminMode extends mixinLoadable(Component) {
	static get styles() { return [super.styles || css``, styles] }
	errorMessage = "error in admin controls"
	loadingMessage = "loading admin controls"
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean

	firstUpdated() {
		this["initially-hidden"] = false
	}

	updated() {
		const {settingsLoad} = this.share
		this.loadableState = loading.select(settingsLoad, {
			none: () => LoadableState.Loading,
			loading: () => LoadableState.Loading,
			error: reason => LoadableState.Error,
			ready: settings => LoadableState.Ready,
		})
	}

	private _handleAdminModeChange = (event: InputEvent) => {
		const adminMode = !!(<HTMLInputElement>event.currentTarget).checked
		const {setAdminMode, settingsLoad} = this.share
		const settings = loading.payload(settingsLoad)
		const newSettings = deepClone(settings)
		newSettings.admin.actAsAdmin = adminMode
		const changes = !deepEqual(settings, newSettings)
		if (changes) setAdminMode({adminMode})
	}

	renderReady() {
		const {user, settingsLoad} = this.share
		const settings = loading.payload(settingsLoad)
		const adminClaim = user?.claims?.admin
		const adminMode = settings?.admin?.actAsAdmin
		return (adminClaim && settings) ? html`
			<input
				type="checkbox"
				?checked=${adminMode}
				@change=${this._handleAdminModeChange}
				@keyup=${this._handleAdminModeChange}
				/>
			<label><slot>Admin mode</slot></label>
		` : null
	}
}

const styles = css`
	:host {
		color: var(--metal-admin-color, #fd34e2);
	}
`
