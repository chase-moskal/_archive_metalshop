
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {LitElement, property, html, css} from "lit-element"

const styles = css`

* {
	margin: 0;
	padding: 0;
}

`

@mixinStyles(styles)
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
}
