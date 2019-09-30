import { parse } from "./parse.js";
import { initialize } from "./initialize.js";
import { select } from "../toolbox/selects.js";
export async function optionsFromDom(selector) {
    const element = select(selector);
    const config = parse(element);
    return initialize(config);
}
//# sourceMappingURL=options-from-dom.js.map