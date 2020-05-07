
import {AdminOnlyShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

@mixinStyles(css`
	:host {
		color: var(--metal-admin-color, #ff5c98);
		--coolbutton-background: var(--metal-admin-color, #ff5c98);
	}

	:host([block]) {
		display: block;
		padding: 1em 0.5em !important;
		border: 1px solid;
		border-radius: 3px;
	}

	:host([not-admin]) {
		display: none !important;
	}

	.header {
		opacity: 0.5;
		font-size: 1.2em;
		text-transform: uppercase;
		margin-bottom: 0.5em;
	}
`)
export class MetalAdminOnly extends MetalshopComponent<AdminOnlyShare> {
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: Boolean, reflect: true}) ["block"]: boolean
	@property({type: Boolean, reflect: true}) ["header"]: boolean
	@property({type: Boolean, reflect: true}) ["admin"]: boolean = false
	@property({type: Boolean, reflect: true}) ["not-admin"]: boolean = true
	@property({type: Object}) private load = loading.load<any>()

	firstUpdated() {
		this["initially-hidden"] = false
	}

	async autorun() {
		const {authLoad, settingsLoad} = this.share
		this.load = loading.meta(authLoad, settingsLoad)
		const loadingIsDone = loading.isReady(this.load)

		if (loadingIsDone) {
			const {getAuthContext} = loading.payload(authLoad)
			const settings = loading.payload(settingsLoad)
			const {user} = await getAuthContext()
			this["admin"] = !!user?.claims?.admin && !!settings?.admin?.actAsAdmin
			this["not-admin"] = !this["admin"]
		}
		else {
			this["admin"] = false
			this["not-admin"] = !this["admin"]
		}

		this.requestUpdate()
	}

	render() {
		return !this.admin ? null : html`
			${!!this["header"] ? html`
				<p class="header"><strong>Admin-only controls</strong></p>
			` : null}
			<slot></slot>
		`
	}
}
