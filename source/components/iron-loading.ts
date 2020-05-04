
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "../components/styles/iron-loading-styles.js"
import {LitElement, TemplateResult, property, html, css} from "lit-element"

import {spinner as spinnerIcon, error as errorIcon} from "../system/icons.js"

@mixinStyles(styles)
export class IronLoading<Payload = any> extends LitElement {
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: String}) error: string = "error"
	@property({type: String}) loading: string = "loading"
	@property({type: Boolean, reflect: true}) loaded = false
	@property({type: String, reflect: true}) state: string = "none"
	private _load = loading.load<Payload>()
	get load(): loading.Load<Payload> { return this._load }
	set load(value: loading.Load<Payload>) {
		if (!value) value = loading.none()
		this._load = value
		this.loaded = !!loading.payload(value)
		this.state = loading.LoadState[value.state].toLowerCase()
		this.requestUpdate()
	}

	firstUpdated() {
		this["initially-hidden"] = false
	}

	renderNone(): TemplateResult {
		return html`
			<slot name="none"></slot>
		`
	}

	renderLoading(): TemplateResult {
		return html`
			<slot name="loading">
				<div class="icon">
					${spinnerIcon}
					<span>${this.loading}</span>
				</div>
			</slot>
		`
	}

	renderError(reason: string): TemplateResult {
		return html`
			<slot name="error">
				<div class="icon">
					${errorIcon}
					<span>${this.error}</span>
					<span>${reason}</span>
				</div>
			</slot>
		`
	}

	renderReady(payload: Payload): TemplateResult {
		return html`
			<slot></slot>
		`
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
