export * from "mobx";
import { objectMap } from "../toolbox/object-map.js";
import { action, computed, observable } from "mobx";
export const actionelize = (o) => objectMap(o, v => action(v));
export const computelize = (o) => objectMap(o, v => computed(v));
export const observelize = (o) => objectMap(o, v => observable(v));
//# sourceMappingURL=mobb.js.map