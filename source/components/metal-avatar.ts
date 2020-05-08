
import {silhouette} from "../system/icons.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, property, html, css} from "../framework/metalshop-component.js"

@mixinStyles(css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:host {
		--avatar-premium-color: var(--premium-color, yellow);
		display: block;
		width: var(--avatar-size, 3em);
		height: var(--avatar-size, 3em);
		max-width: var(--avatar-max-width, 100%);
		max-height: var(--avatar-max-height, 100%);
		overflow: hidden;
		border: var(--avatar-border, 0 solid rgba(255,255,255, 0.1));
		transition: border 1s ease;
	}

	:host([premium]) {
		border: var(--avatar-border-premium, 4px solid var(--avatar-premium-color));
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
`)
export class MetalAvatar extends MetalshopComponent<{}> {
	@property({type: String}) src: string = ""
	@property({type: Object}) defaultPicture = silhouette
	@property({type: Boolean, reflect: true}) premium: boolean = false

	render() {
		const {src} = this
		return src
			? html`<img src=${src} alt=""/>`
			: this.defaultPicture
	}
}
