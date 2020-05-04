
import {LitElement} from "lit-element"
import {ConstructorFor} from "../interfaces.js"
import {autorun, IReactionDisposer} from "mobx"

const _autorunClear = Symbol("_autorunClear")
const _autorunDispose = Symbol("_autorunDispose")
const _autorunInitialize = Symbol("_autorunInitialize")

type MixinIn = ConstructorFor<LitElement>
type MixinOut = ConstructorFor<{autorun: () => void}>

export function mixinAutorun<C extends MixinIn>(Constructor: C): C & MixinOut {
	return class LitElementWithMobxAutorun extends Constructor {

		autorun() {}

		connectedCallback() {
			this[_autorunInitialize]()
			super.connectedCallback()
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			this[_autorunClear]()
		}

		private [_autorunDispose]: IReactionDisposer

		private [_autorunClear]() {
			const dispose = this[_autorunDispose]
			if (dispose) dispose()
			this[_autorunDispose] = undefined
		}

		private [_autorunInitialize]() {
			this[_autorunClear]()
			this[_autorunDispose] = autorun(() => this.autorun())
		}
	}
}
