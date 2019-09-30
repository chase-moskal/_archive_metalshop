var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../../toolbox/loading.js";
import { LitElement, html, property } from "lit-element";
export class DemoIronLoading extends LitElement {
    constructor() {
        super(...arguments);
        this.load = loading.load();
        this.handleNoneClick = () => { this.load = loading.none(); };
        this.handleLoadingClick = () => { this.load = loading.loading(); };
        this.handleErrorClick = () => { this.load = loading.error(); };
        this.handleReadyClick = () => { this.load = loading.ready(); };
    }
    render() {
        return html `
			<div class="buttonbar">
				<button @click=${this.handleNoneClick} class="l-none">none</button>
				<button @click=${this.handleLoadingClick} class="l-loading">loading</button>
				<button @click=${this.handleErrorClick} class="l-error">error</button>
				<button @click=${this.handleReadyClick} class="l-ready">ready</button>
			</div>
			<iron-loading .load=${this.load}>ready</iron-loading>
		`;
    }
}
__decorate([
    property({ type: Object })
], DemoIronLoading.prototype, "load", void 0);
//# sourceMappingURL=demo-iron-loading.js.map