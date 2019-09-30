import { AuthoritarianStartupError } from "../system/errors.js";
const err = (message) => new AuthoritarianStartupError(message);
export function parse(element) {
    if (!element)
        throw err(`<metal-config> required, missing`);
    const config = {};
    for (const { name, value } of Array.from(element.attributes)) {
        config[name] = value;
    }
    return config;
}
//# sourceMappingURL=parse.js.map