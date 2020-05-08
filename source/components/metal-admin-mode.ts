
import * as loading from "../toolbox/loading.js"
import {AdminModeShare} from "../interfaces.js"
import {deepEqual, deepClone} from "../toolbox/deep.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

@mixinStyles(css`
	:host {
		color: var(--metal-admin-color, #fd34e2);
	}
`)
export class MetalAdminMode extends MetalshopComponent<AdminModeShare> {

	@property({type: Boolean, reflect: true})
		["initially-hidden"]: boolean

	@property({type: Boolean})
		private adminMode: boolean = false

	@property({type: Boolean})
		private adminClaim: boolean = false

	firstUpdated() {
		this["initially-hidden"] = false
	}

	async autorun() {
		const {authLoad, settingsLoad} = this.share
		const settings = loading.payload(settingsLoad)
		const getAuthContext = loading.payload(authLoad)?.getAuthContext
		if (getAuthContext && settings) {
			const {user} = await getAuthContext()
			this.adminClaim = user.claims.admin
			this.adminMode = settings.admin.actAsAdmin
		}
		else {
			this.adminMode = false
			this.adminClaim = false
		}
	}

	render() {
		const {adminClaim, adminMode} = this
		return adminClaim ? html`
			<input
				type="checkbox"
				?checked=${adminMode}
				@change=${this._handleAdminModeChange}
				@keyup=${this._handleAdminModeChange}
				/>
			<label><slot>Admin mode</slot></label>
		` : null
	}

	private _handleAdminModeChange = (event: InputEvent) => {
		const adminMode = !!(<HTMLInputElement>event.currentTarget).checked
		const {setAdminMode, settingsLoad} = this.share
		const settings = loading.payload(settingsLoad)
		const newSettings = deepClone(settings)
		newSettings.admin.actAsAdmin = adminMode
		const changes = !deepEqual(settings, newSettings)
		if (changes) return setAdminMode(adminMode)
	}
}
