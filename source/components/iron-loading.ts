
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "../components/styles/iron-loading-styles.js"
import {LitElement, TemplateResult, property, html, css} from "lit-element"

@mixinStyles(styles)
export class IronLoading<Payload = any> extends LitElement {
	@property({type: Object}) load = loading.load<Payload>()

	renderNone(): TemplateResult {
		return html`<slot name="none">LOAD:none</slot>`
	}

	renderLoading(): TemplateResult {
		return html`<slot name="loading">LOAD:loading</slot>`
	}

	renderError(reason: string): TemplateResult {
		return html`<slot name="error">LOAD:error ${reason}</slot>`
	}

	renderReady(payload: Payload): TemplateResult {
		return html`<slot>LOAD:ready</slot>`
	}

	render() {
		return loading.select(this.load, {
			none: () => this.renderNone(),
			loading: () => this.renderLoading(),
			error: reason => this.renderError(reason),
			ready: payload => this.renderReady(payload),
		})
	}
}
