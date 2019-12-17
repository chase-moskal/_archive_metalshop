
import {LitElement} from "lit-element"
import {Unsubscribe, Reader} from "../toolbox/pubsub.js"
import {SimpleModel, ConstructorFor} from "../interfaces.js"

const _unsubscribe = Symbol()

export abstract class ComponentWithModel<
	M extends SimpleModel = SimpleModel,
> extends LitElement {
	static model: SimpleModel
	model: M
	subscribeToReader(reader: Reader): void {}
}

export function mixinModelSubscription<
	M extends SimpleModel,
	C extends ConstructorFor<LitElement>,
>(Constructor: C): typeof LitElement & ConstructorFor<ComponentWithModel<M>> & C {

	return <any>class extends Constructor implements ComponentWithModel<M> {
		static model: SimpleModel

		private [_unsubscribe]: Unsubscribe[] = []
		model: M = (<any>this.constructor).model

		subscribeToReader(reader: Reader) {
			this[_unsubscribe].push(reader.subscribe(() => this.requestUpdate()))
		}

		connectedCallback() {
			super.connectedCallback()
			const {model} = this
			if (!model) throw new Error("component model missing")
			if (model.reader) this.subscribeToReader(model.reader)
		}

		disconnectedCallback() {
			for (const unsubscribe of this[_unsubscribe] || []) {
				unsubscribe()
			}
			this[_unsubscribe] = []
			super.disconnectedCallback()
		}
	}
}
