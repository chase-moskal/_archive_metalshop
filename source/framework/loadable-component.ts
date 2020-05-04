
import {Share} from "./share.js"
import {mixinStyles} from "./mixin-styles.js"
import {styles} from "./styles/loadable-component-styles.js"
import {MetalshopComponent, html, svg, property} from "./metalshop-component.js"

export enum LoadableState {
	Loading,
	Error,
	Ready
}

export class LoadableComponentError extends Error {}
const err = (message: string) => new LoadableComponentError(message)

export interface LoadableSignature {
	errorMessage: string
	loadingMessage: string
	loadableState: LoadableState
	renderReady(): void
}

const _state = Symbol()
const _renderError = Symbol()
const _renderLoading = Symbol()

@mixinStyles(styles)
export class LoadableComponent<S extends Share> extends MetalshopComponent<S> implements LoadableSignature {
	@property({type: String}) errorMessage: string = "error"
	@property({type: String}) loadingMessage: string = "loading..."
	@property({type: Number}) [_state]: LoadableState = LoadableState.Loading

	set loadableState(value: LoadableState) { this[_state] = value }
	get loadableState(): LoadableState { return this[_state] }

	render() {
		switch (this[_state]) {
			case LoadableState.Loading: return this[_renderLoading]()
			case LoadableState.Error: return this[_renderError]()
			case LoadableState.Ready: return this.renderReady()
		}
	}

	renderReady() {
		throw err(`renderReady must be implemented`)
	}

	[_renderLoading]() {
		return html`
			<div class="loadable loading">
				${svg`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`}
				<p>${this.loadingMessage}</p>
			</div>
		`
	}

	[_renderError]() {
		return html`
			<div class="loadable error">
				${svg`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>`}
				<p>${this.errorMessage}</p>
			</div>
		`
	}
}
