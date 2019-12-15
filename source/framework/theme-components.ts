
import {LitElement, CSSResult} from "lit-element"

import {mixinCss} from "./mixin-css.js"
import {objectMap} from "../toolbox/object-map.js"

export function themeComponents<C extends new(...args: any[]) => LitElement>(
	theme: CSSResult | CSSResult[],
	components: {[key: string]: C}
) {
	return objectMap(components, Component => mixinCss(theme, Component))
}
