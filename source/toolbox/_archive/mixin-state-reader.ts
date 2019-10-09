
import {
	Reader,
	Unsubscribe,
	WebComponent,
} from "../../system/interfaces.js"

export type Constructor<T = {}> = new(...args: any[]) => T

export function mixinStateReader<
	S extends {},
	C extends Constructor<WebComponent>
>(Class: C) {
	return class ReaderComponent extends Class {
		state: S
		reader: Reader<S>
		__unsubscribe: Unsubscribe = null

		stateUpdateCallback() {}

		__attemptSubscribe() {
			if (!this.reader || this.__unsubscribe) return
			this.__unsubscribe = this.reader.subscribe(() => {
				this.state = this.reader.state
				this.stateUpdateCallback()
			})
		}

		connectedCallback() {
			super.connectedCallback()
			this.__attemptSubscribe()
		}

		attributeChangedCallback(
			name: string,
			oldValue: string,
			newValue: string
		) {
			super.attributeChangedCallback(name, oldValue, newValue)
			if (name === "reader") {
				this.__attemptSubscribe()
			}
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			if (this.__unsubscribe) {
				this.__unsubscribe()
			}
			this.__unsubscribe = null
		}
	}
}
