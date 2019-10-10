
import {CSSResult, LitElement} from "lit-element"

export type Constructor<T = {}> = new(...args: any[]) => T

export function mixinCss(styles: CSSResult | CSSResult[], Class: typeof LitElement): typeof LitElement {
	const css = Array.isArray(styles) ? styles : [styles]
	return class ClassWithCss extends Class {
		static get styles() {return [
			...css,
			super.styles
		]}
	}
}
