
import {property, html, css, svg} from "lit-element"

import {PaywallPanelAccess} from "../interfaces.js"
import {PaywallMode} from "../models/paywall-model.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

const icons = {
	star: svg`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"/></svg>`
}

export class PaywallPanel extends LoadableElement {
	loadingMessage = "loading paywall panel"
	@property({type: Object}) access: PaywallPanelAccess

	updated() {
		if (!this.access) return
		switch (this.access.state.mode) {
			case PaywallMode.Loading:
				this.loadableState = LoadableState.Loading
				break
			case PaywallMode.Error:
				this.loadableState = LoadableState.Error
				break
			default:
				this.loadableState = LoadableState.Ready
		}
	}

	static get styles() {
		return [super.styles, css`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`]
	}

	private _renderNotPremium() {
		const {actions} = this.access
		return html`
			<p>Become a premium user!</p>
			<button @click=${actions.makeUserPremium}>Subscribe</button>
		`
	}

	private _renderPremium() {
		const {actions} = this.access
		return html`
			<div class="icon">${icons.star}</div>
			<p>You are Premium!</p>
			<button @click=${actions.revokeUserPremium}>Unsubscribe</button>
		`
	}

	renderReady() {
		if (!this.access) return html``
		switch (this.access.state.mode) {
			case PaywallMode.LoggedOut: return html``
			case PaywallMode.NotPremium: return this._renderNotPremium()
			case PaywallMode.Premium: return this._renderPremium()
		}
	}
}
