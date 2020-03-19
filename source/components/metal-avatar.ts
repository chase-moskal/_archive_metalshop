
import {LitElement, property, html, css} from "lit-element"

import {silhouette} from "../system/icons.js"

export class MetalAvatar extends LitElement {
	static get styles() { return [super.styles || css``, styles] }
	@property({type: String}) src: string = ""
	@property({type: Boolean}) premium: boolean = false
	@property({type: Object}) defaultPicture = silhouette

	render() {
		const {src} = this
		return src
			? html`<img src=${src} alt=""/>`
			: this.defaultPicture
	}
}

const styles = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:host {
		display: block;
		width: var(--avatar-size, 3em);
		height: var(--avatar-size, 3em);
		max-width: var(--avatar-max-width, 100%);
		max-height: var(--avatar-max-height, 100%);
		overflow: hidden;
	}

	:host([premium]) {
		border: 2px solid yellow;
	}

	:host([hidden]) {
		display: none;
	}

	svg, img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`
