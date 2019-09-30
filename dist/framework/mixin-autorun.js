import { autorun } from "mobx";
const _autorunClear = Symbol("_autorunClear");
const _autorunDisposers = Symbol("_autorunDisposers");
const _autorunInitialize = Symbol("_autorunInitialize");
export function mixinAutorun(Constructor) {
    var _a;
    return class LitElementWithMobxAutorun extends Constructor {
        constructor() {
            super(...arguments);
            this.autoruns = [];
            this[_a] = [];
        }
        autorun() { }
        connectedCallback() {
            this[_autorunInitialize]();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this[_autorunClear]();
        }
        [(_a = _autorunDisposers, _autorunClear)]() {
            for (const dispose of this[_autorunDisposers]) {
                dispose();
            }
            this[_autorunDisposers] = [];
        }
        [_autorunInitialize]() {
            this[_autorunClear]();
            this[_autorunDisposers] = [
                autorun(() => this.autorun()),
                ...this.autoruns.map(run => autorun(() => run)),
            ];
        }
    };
}
//# sourceMappingURL=mixin-autorun.js.map