
import {observer} from "mobx-lit-element"
import {LitElement} from "lit-element"

export {property, html, css, PropertyValues} from "lit-element"

@observer
export class MobxLitElement extends LitElement {}
