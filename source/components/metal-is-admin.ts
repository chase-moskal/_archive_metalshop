
import {AdminOnlyShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

@mixinStyles(css`

	:host([admin][fancy]) {
		display: block;
		padding: 1em 0.5em !important;
		border: 1px solid;
		border-radius: 3px;
		color: var(--metal-admin-color, #ff5c98);
		--coolbutton-background: var(--metal-admin-color, #ff5c98);
	}

	.header {
		opacity: 0.5;
		font-size: 1.2em;
		text-transform: uppercase;
		margin-bottom: 0.5em;
	}

`)
export class MetalIsAdmin extends MetalshopComponent<AdminOnlyShare> {
	@property({type: Boolean, reflect: true}) ["fancy"]: boolean
	@property({type: Boolean, reflect: true}) ["admin"]: boolean = false
	@property({type: Boolean, reflect: true}) ["not-admin"]: boolean = true
	@property({type: Boolean}) private load = loading.load<void>()

	async autorun() {
		const {authLoad, settingsLoad} = this.share

		const auth = loading.payload(authLoad)
		const settings = loading.payload(settingsLoad)
		const user = auth?.user

		this["admin"] = false
		this["not-admin"] = !this["admin"]
		this.load = loading.meta2(authLoad, settingsLoad)

		if (auth && settings || user) {
			this["admin"] = !!user?.claims?.admin && !!settings?.admin?.actAsAdmin
			this["not-admin"] = !this["admin"]
		}

		this.requestUpdate()
	}

	render() {
		const header = this["fancy"]
			? html`<p class="header"><strong>Admin-only controls</strong></p>`
			: null
		return html`
			<iron-loading .load=${this.load}>
				${this["admin"]
					? html`
						${header}
						<slot></slot>
					`
					: html`
						<slot name="not"></slot>
					`}
			</iron-loading>
		`
	}
}