
import {property, html, css, svg} from "lit-element"

import {PaywallState} from "../system/interfaces.js"
import {PaywallMode} from "../models/paywall-model.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

const icons = {
	star: svg`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"/></svg>`
}

export class PaywallPanel extends LoadableElement {
	@property({type: Object}) paywallState: PaywallState
	onMakeUserPremium = async() => {}
	onRevokeUserPremium = async() => {}
	loadingMessage = "loading paywall panel"

	updated() {
		if (!this.paywallState) return
		const {mode} = this.paywallState
		switch (mode) {
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

	static get styles() {return [super.styles, css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		:host {
			display: block;
			padding: 1em 0;
		}

		header svg {
			width: 2em;
			height: 2em;
			margin-right: 0.5em;
			fill: yellow;
		}

		section {
			padding: 1em 0;
		}

		footer > * {
			padding: 0 0.5em;
		}

		footer > button {
			font-size: 1em;
		}

		footer > span {
			font-size: 0.8em;
			opacity: 0.8;
		}
	`]}

	private _renderNotPremium() {return html`
		<header>
			<h3>Become a premium supporter!</h3>
		</header>
		<section>
			<p>It comes with cool features!</p>
		</section>
		<footer>
			<button @click=${this.onMakeUserPremium}>Subscribe</button>
			<span class="price">$5<small>/month</small></span>
		</footer>
	`}

	private _renderPremium() {return html`
		<header>
			<div class="icon">${icons.star}</div>
			<h3>You are a premium supporter!</h3>
		</header>
		<section>
			<p>You have the cool features!</p>
		</section>
		<footer>
			<button @click=${this.onRevokeUserPremium}>Unsubscribe</button>
			<span class="remaining">You have X days remaining</span>
		</footer>
	`}

	renderReady() {
		const {mode} = this.paywallState
		if (mode === undefined) return html``
		switch (mode) {
			case PaywallMode.LoggedOut: return html``
			case PaywallMode.NotPremium: return this._renderNotPremium()
			case PaywallMode.Premium: return this._renderPremium()
		}
	}
}
