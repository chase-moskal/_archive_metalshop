export function mixinInitiallyHidden(Constructor) {
    return class Component extends Constructor {
        firstUpdated() {
            if (this.hasAttribute("initially-hidden"))
                this.removeAttribute("initially-hidden");
        }
    };
}
//# sourceMappingURL=mixin-initially-hidden.js.map