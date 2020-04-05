
export * from "lit-element"
import {Share} from "./share.js"
import {ConstructorFor} from "../interfaces.js"
import {MobxLitElement} from "./mobx-lit-element.js"

export class MetalshopComponent<S extends Share> extends MobxLitElement {
	readonly share: S
}
