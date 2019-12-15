
import {LitElement, property, html, css, svg} from "lit-element"

const defaultPicture = html`${svg`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 0 1-.998.998H1.001A1 1 0 0 1 0 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"/></svg>`}`

export class AvatarDisplay extends LitElement {
	@property({type: String}) src: string = ""
	@property({type: Boolean}) premium: boolean = false
	@property({type: Object}) defaultPicture = defaultPicture

	static get styles() {return css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		:host {
			display: block;
			width: var(--avatar-display-size, 3em);
			height: var(--avatar-display-size, 3em);
			max-width: 100%;
		}
		:host([hidden]) {
			display: none;
		}
		svg, img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			fill: currentColor;
		}
		:host([premium]) img,
		:host([premium]) svg {
			border: 2px solid yellow;
		}
	`}

	render() {
		const {src} = this
		return src
			? html`<img src=${src} alt=""/>`
			: this.defaultPicture
	}
}
