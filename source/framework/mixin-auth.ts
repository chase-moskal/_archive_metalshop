
import {LitElement} from "lit-element"
import {Unsubscribe} from "../toolbox/pubsub.js"
import {SimpleModel, ConstructorFor} from "../interfaces.js"

const _unsubscribe = Symbol()

export class AuthComponent<
	M extends SimpleModel = SimpleModel,
> extends LitElement {
	static model: SimpleModel
	model: M
	authUpdate() {}
}

export function mixinAuth<
	M extends SimpleModel,
	C extends ConstructorFor<LitElement>,
>(Constructor: C): typeof LitElement & ConstructorFor<AuthComponent<M>> & C {

	return <any>class extends Constructor implements AuthComponent<M> {
		static model: SimpleModel

		private [_unsubscribe]: Unsubscribe
		model: M = (<any>this.constructor).model

		authUpdate() {}

		connectedCallback() {
			super.connectedCallback()
			const {model} = this
			if (!model) throw new Error("auth component model missing")

			this.authUpdate()
			this[_unsubscribe] = model.reader.subscribe(
				() => {
					this.authUpdate()
					this.requestUpdate()
				}
			)
		}

		disconnectedCallback() {
			this[_unsubscribe]()
			this[_unsubscribe] = null
			super.disconnectedCallback()
		}
	}
}
