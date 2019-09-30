export const share = (Constructor, getter) => class extends Constructor {
    get share() { return getter(); }
};
//# sourceMappingURL=share.js.map