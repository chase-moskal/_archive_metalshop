var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MobxLitElement } from "@adobe/lit-mobx";
import { theme } from "../system/theme.js";
import { mixinStyles } from "./mixin-styles.js";
import { mixinAutorun } from "./mixin-autorun.js";
import { mixinInitiallyHidden } from "./mixin-initially-hidden.js";
export * from "lit-element";
export { MobxLitElement };
let MetalshopComponent = class MetalshopComponent extends MobxLitElement {
};
MetalshopComponent = __decorate([
    mixinAutorun,
    mixinStyles(theme),
    mixinInitiallyHidden
], MetalshopComponent);
export { MetalshopComponent };
//# sourceMappingURL=metalshop-component.js.map