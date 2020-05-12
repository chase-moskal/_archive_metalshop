
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "../components/styles/iron-loading-styles.js"
import {LitElement, TemplateResult, property, html} from "lit-element"
import {mixinInitiallyHidden} from "../framework/mixin-initially-hidden.js"
import {spinner as spinnerIcon, error as errorIcon} from "../system/icons.js"

 @mixinStyles(styles)
 @mixinInitiallyHidden
export class IronLoading<Payload = any> extends LitElement {

	 @property({type: String})
	error: string = "error"

	 @property({type: String})
	loading: string = "loading"

	//
	// load and derived properties
	//

	 @property({type: String, reflect: true})
	state: string = "none"

	private _load = loading.load<Payload>()

	get load(): loading.Load<Payload> {
		return this._load
	}

	set load(value: loading.Load<Payload>) {
		if (!value) value = loading.none()
		this._load = value
		this.state = loading.LoadState[value.state].toLowerCase()
		this.requestUpdate()
	}

	//
	// overwritable rendering methods
	//

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

	//
	// render each loading state
	//

	render() {
		return loading.select(this.load, {
			none: () => this.renderNone(),
			loading: () => this.renderLoading(),
			error: reason => this.renderError(reason),
			ready: payload => this.renderReady(payload),
		})
	}
}
