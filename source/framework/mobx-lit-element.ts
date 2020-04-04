
import {observer} from "mobx-lit-element"
import {LitElement} from "lit-element"

export {property, html, css} from "lit-element"

@observer
export class MobxLitElement extends LitElement {}
