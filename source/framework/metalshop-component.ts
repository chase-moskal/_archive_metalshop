
import {Share} from "./share.js"
import {theme} from "../system/theme.js"
import {mixinStyles} from "./mixin-styles.js"
import {MobxLitElement} from "@adobe/lit-mobx"
import {mixinAutorun} from "./mixin-autorun.js"
import {mixinInitiallyHidden} from "./mixin-initially-hidden.js"

export * from "lit-element"
export {Share, MobxLitElement}

@mixinAutorun
@mixinStyles(theme)
@mixinInitiallyHidden
export class MetalshopComponent<S extends Share> extends MobxLitElement {
	readonly share: S
}
