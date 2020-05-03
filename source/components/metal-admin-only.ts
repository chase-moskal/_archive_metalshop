
import * as loading from "../toolbox/loading.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {ProfileMode, AdminOnlyShare, ConstructorFor} from "../interfaces.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

const Component: ConstructorFor<MetalshopComponent<AdminOnlyShare>> =
	MetalshopComponent

export class MetalAdminOnly extends mixinLoadable(Component) {
	static get styles() { return [super.styles || css``, styles] }
	errorMessage = "error in admin area"
	loadingMessage = "loading admin area"
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: Boolean, reflect: true}) ["block"]: boolean
	@property({type: Boolean, reflect: true}) ["header"]: boolean
	@property({type: Boolean, reflect: true}) ["admin"]: boolean = false
	@property({type: Boolean, reflect: true}) ["not-admin"]: boolean = true

	firstUpdated() {
		this["initially-hidden"] = false
	}

	updated() {
		const {user, settingsLoad} = this.share
		const settings = loading.payload(settingsLoad)
		this["admin"] = !!user?.claims?.admin && !!settings?.admin?.actAsAdmin
		this["not-admin"] = !this["admin"]
		this.loadableState = loading.select(settingsLoad, {
			none: () => LoadableState.Loading,
			loading: () => LoadableState.Loading,
			error: reason => LoadableState.Error,
			ready: settings => LoadableState.Ready,
		})
	}

	renderReady() {
		const {admin} = this
		return !admin ? null : html`
			${!!this["header"] ? html`
				<p class="header"><strong>Admin-only controls</strong></p>
			` : null}
			<slot></slot>
		`
	}
}

const styles = css`
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
`
