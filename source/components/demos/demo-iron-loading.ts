
import * as loading from "../../toolbox/loading.js"
import {LitElement, html, property} from "lit-element"

export class DemoIronLoading extends LitElement {

	@property({type: Object})
		private load = loading.load<void>()

	private handleNoneClick = () => { this.load = loading.none() }
	private handleLoadingClick = () => { this.load = loading.loading() }
	private handleErrorClick = () => { this.load = loading.error() }
	private handleReadyClick = () => { this.load = loading.ready() }

	render() {
		return html`
			<div class="buttonbar">
				<button @click=${this.handleNoneClick} class="l-none">none</button>
				<button @click=${this.handleLoadingClick} class="l-loading">loading</button>
				<button @click=${this.handleErrorClick} class="l-error">error</button>
				<button @click=${this.handleReadyClick} class="l-ready">ready</button>
			</div>
			<iron-loading .load=${this.load}>ready</iron-loading>
		`
	}
}
