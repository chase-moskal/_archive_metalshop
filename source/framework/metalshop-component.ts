
import {MobxLitElement} from "@adobe/lit-mobx"

import {Share} from "./share.js"
import {mixinAutorun} from "./mixin-autorun.js"
import {mixinInitiallyHidden} from "./mixin-initially-hidden.js"

export * from "lit-element"
export {Share, MobxLitElement}

@mixinAutorun
@mixinInitiallyHidden
export class MetalshopComponent<S extends Share> extends MobxLitElement {
	readonly share: S
}
