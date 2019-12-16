
import {LitElement} from "lit-element"
import {Unsubscribe} from "../toolbox/pubsub.js"
import {SimpleModel, ConstructorFor} from "../interfaces.js"

const _unsubscribe = Symbol()

export class ComponentWithModel<
	M extends SimpleModel = SimpleModel,
> extends LitElement {
	static model: SimpleModel
	model: M
}

export function mixinModelSubscription<
	M extends SimpleModel,
	C extends ConstructorFor<LitElement>,
>(Constructor: C): typeof LitElement & ConstructorFor<ComponentWithModel<M>> & C {

	return <any>class extends Constructor implements ComponentWithModel<M> {
		static model: SimpleModel

		private [_unsubscribe]: Unsubscribe
		model: M = (<any>this.constructor).model

		connectedCallback() {
			super.connectedCallback()
			const {model} = this
			if (!model) throw new Error("component model missing")

			this[_unsubscribe] = model.reader.subscribe(
				() => this.requestUpdate()
			)
		}

		disconnectedCallback() {
			this[_unsubscribe]()
			this[_unsubscribe] = null
			super.disconnectedCallback()
		}
	}
}
