
export * from "lit-element"
import {LitElement} from "lit-element"
import {ConstructorFor} from "../interfaces.js"
import {autorun, IReactionDisposer} from "mobx"

export const _autorunClear = Symbol("_autorunClear")
export const _autorunDispose = Symbol("_autorunDispose")
export const _autorunInitialize = Symbol("_autorunInitialize")

export function mixinAutorun<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C & ConstructorFor<{autorun: () => void}> {
	return class LitElementWithMobxAutorun extends Constructor {

		autorun() {}
		[_autorunDispose]: IReactionDisposer
		[_autorunClear]() {
			const dispose = this[_autorunDispose]
			if (dispose) dispose()
			this[_autorunDispose] = undefined
		}
		[_autorunInitialize]() {
			this[_autorunClear]()
			this[_autorunDispose] = autorun(() => this.autorun)
		}

		connectedCallback() {
			this[_autorunInitialize]()
			super.connectedCallback()
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			this[_autorunClear]()
		}
	}
}
