
import {LitElement} from "lit-element"
import {Unsubscribe} from "../toolbox/pubsub.js"
import {AuthModel, ConstructorFor} from "../interfaces.js"

const _unsubscribe = Symbol()

export class AuthComponent<
	M extends AuthModel = AuthModel,
> extends LitElement {
	static model: AuthModel
	model: M
	authUpdate() {}
}

export function mixinAuth<
	M extends AuthModel,
	C extends ConstructorFor<LitElement>,
>(Constructor: C): typeof LitElement & ConstructorFor<AuthComponent<M>> & C {

	return <any>class extends Constructor implements AuthComponent<M> {
		static model: AuthModel

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
