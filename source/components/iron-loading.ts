
import * as loading from "../toolbox/loading.js"
import {LitElement, property, html, css, TemplateResult} from "lit-element"

export const litLoading = <Payload>(
		load: loading.Load<Payload>,
		renderReady: (payload: Payload) => TemplateResult,
	) => loading.select(load, {
	none: () => html`<div data-load="none">none</div>`,
	loading: () => html`<div data-load="loading">loading</div>`,
	error: reason => html`<div data-load="error">error: <span .textContent=${reason}></span></div>`,
	ready: payload => html`<div data-load="ready">${renderReady(payload)}</div>`,
})

export class IronLoading<Payload = any> extends LitElement {
	@property({type: Object}) load = loading.load<Payload>()

	@property({type: Function}) renderReady = (payload: Payload) => html`
		<p>done loading</p>
	`

	render() {
		const {load, renderReady} = this
		return loading.select(load, {
			none: () => html`
				<slot name="none">load:none</slot>
			`,
			loading: () => html`
				<slot name="loading">load:loading</slot>
			`,
			error: reason => html`
				<slot name="error">load:error: <span .textContent=${reason}></span></slot>
			`,
			ready: payload => html`
				<slot data-load="ready">${renderReady(payload)}</slot>
			`,
		})
	}

	static css = css`
		* {
			margin: 0;
			padding: 0;
		}
	`
}
