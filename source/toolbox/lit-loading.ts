
import * as loading from "../toolbox/loading.js"
import {TemplateResult, html, css} from "lit-element"

export const litLoading = <Payload>(
		load: loading.Load<Payload>,
		renderReady: (payload: Payload) => TemplateResult,
	) => loading.select(load, {
	none: () => html`
		<div data-load="none">none</div>
	`,
	loading: () => html`
		<div data-load="loading">loading</div>
	`,
	error: reason => html`
		<div data-load="error">error: <span .textContent=${reason}></span></div>
	`,
	ready: payload => html`
		<div data-load="ready">${renderReady(payload)}</div>
	`,
})

export const litLoadingStyles = css`
	[data-load="none"] {
		display: block;
	}
	[data-load="loading"] {
		display: block;
	}
	[data-load="error"] {
		color: red;
	}
	[data-load="ready"] {
		display: block;
	}
`
