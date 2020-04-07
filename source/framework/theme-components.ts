
import {mixinCss} from "./mixin-css.js"
import {LitElement, CSSResult} from "lit-element"
import {objectMap} from "../toolbox/object-map.js"

export const themeComponents = <C extends new(...args: any[]) => LitElement>(
	theme: CSSResult | CSSResult[],
	components: {[key: string]: C}
) => objectMap(components, Component => mixinCss(theme, Component))
