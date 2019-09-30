const arrayize = (item) => Array.isArray(item)
    ? item
    : [item];
const stylize = (...styleses) => {
    let final = [];
    for (const styles of styleses)
        final = [...final, ...arrayize(styles || [])];
    return final;
};
export function mixinStyles(style, ...moreStyles) {
    return function mixinStylesActual(Constructor) {
        var _a;
        return _a = class LitElementWithStyle extends Constructor {
            },
            _a.styles = stylize(Constructor.styles, ...[style, ...moreStyles]),
            _a;
    };
}
//# sourceMappingURL=mixin-styles.js.map