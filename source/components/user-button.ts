
import {LitElement, property, html, css, svg, PropertyValues} from "lit-element"
import {dashifyEventName, UserLogoutEvent, ProfileLoadedEvent} from "../events.js"

const defaultPicture = html`${svg`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 0 1-.998.998H1.001A1 1 0 0 1 0 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"/></svg>`}`

export class UserButton extends LitElement {
	@property({type: Object}) defaultPicture = defaultPicture
	@property({type: Object}) picture = html`${this.defaultPicture}`

	private _windowEventListeners = {
		[dashifyEventName(ProfileLoadedEvent)]: (event: ProfileLoadedEvent) => {
			const {picture} = event.detail
			this.picture = html`<img src=${picture} alt="[your profile picture]"/>`
		},
		[dashifyEventName(UserLogoutEvent)]: () => {
			this.picture = this.defaultPicture
		}
	}

	protected updated(changedProperties: PropertyValues) {
		if (changedProperties.has("defaultPicture")) {
			this.picture = this.defaultPicture
		}
	}

	connectedCallback() {
		for (const [eventName, eventHandler]
			of Object.entries(this._windowEventListeners))
				window.addEventListener(eventName, eventHandler)
		super.connectedCallback()
	}

	disconnectedCallback() {
		for (const [eventName, eventHandler]
			of Object.entries(this._windowEventListeners))
				window.removeEventListener(eventName, eventHandler)
		super.disconnectedCallback()
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: var(--user-button-size, 3em);
				height: var(--user-button-size, 3em);
			}
			:host([hidden]) {
				display: none;
			}
			svg, img {
				width: 100%;
				height: 100%;
			}
		`
	}

	render() {
		return html`${this.picture}`
	}
}
