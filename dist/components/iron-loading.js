var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { styles } from "../components/styles/iron-loading-styles.js";
import { LitElement, property, html } from "lit-element";
import { mixinInitiallyHidden } from "../framework/mixin-initially-hidden.js";
import { spinner as spinnerIcon, error as errorIcon } from "../system/icons.js";
let IronLoading = class IronLoading extends LitElement {
    constructor() {
        super(...arguments);
        this.error = "error";
        this.loading = "loading";
        //
        // load and derived properties
        //
        this.state = "none";
        this._load = loading.load();
    }
    get load() {
        return this._load;
    }
    set load(value) {
        if (!value)
            value = loading.none();
        this._load = value;
        this.state = loading.LoadState[value.state].toLowerCase();
        this.requestUpdate();
    }
    //
    // overwritable rendering methods
    //
    renderNone() {
        return html `
			<slot name="none"></slot>
		`;
    }
    renderLoading() {
        return html `
			<slot name="loading">
				<div class="icon">
					${spinnerIcon}
					<span>${this.loading}</span>
				</div>
			</slot>
		`;
    }
    renderError(reason) {
        return html `
			<slot name="error">
				<div class="icon">
					${errorIcon}
					<span>${this.error}</span>
					<span>${reason}</span>
				</div>
			</slot>
		`;
    }
    renderReady(payload) {
        return html `
			<slot></slot>
		`;
    }
    //
    // render each loading state
    //
    render() {
        return loading.select(this.load, {
            none: () => this.renderNone(),
            loading: () => this.renderLoading(),
            error: reason => this.renderError(reason),
            ready: payload => this.renderReady(payload),
        });
    }
};
__decorate([
    property({ type: String })
], IronLoading.prototype, "error", void 0);
__decorate([
    property({ type: String })
], IronLoading.prototype, "loading", void 0);
__decorate([
    property({ type: String, reflect: true })
], IronLoading.prototype, "state", void 0);
IronLoading = __decorate([
    mixinStyles(styles),
    mixinInitiallyHidden
], IronLoading);
export { IronLoading };
//# sourceMappingURL=iron-loading.js.map