
import {CSSResult, LitElement} from "lit-element"

export function mixinCss<T extends typeof LitElement>(
	styles: CSSResult | CSSResult[],
	Component: T
): T {
	const css = Array.isArray(styles) ? styles : [styles]
	const C = <typeof LitElement><any>Component
	return <any>class ComponentWithStyle extends C {
		static get styles() {return [
			...css,
			super.styles || []
		]}
	}
}
