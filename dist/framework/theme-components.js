import { mixinStyles } from "./mixin-styles.js";
import { objectMap } from "../toolbox/object-map.js";
export const themeComponents = (theme, components) => {
    const mixinTheme = mixinStyles(theme);
    return objectMap(components, Component => mixinTheme(Component));
};
//# sourceMappingURL=theme-components.js.map