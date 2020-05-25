
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

	@property({type: Boolean})
		private adminMode: boolean = false

	@property({type: Boolean})
		private adminClaim: boolean = false

	async autorun() {
		const {personalLoad} = this.share
		const personal = loading.payload(personalLoad)

		if (personal) {
			this.adminClaim = !!personal.user.claims.admin
			this.adminMode = !!personal.settings.admin.actAsAdmin
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
		const {personalLoad, setAdminMode} = this.share
		const personal = loading.payload(personalLoad)
		if (!personal) throw new Error("personal not loaded")
		const newSettings = deepClone(personal.settings)
		newSettings.admin.actAsAdmin = adminMode
		const changes = !deepEqual(personal.settings, newSettings)
		if (changes) return setAdminMode(adminMode)
	}
}
