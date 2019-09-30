var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, action } from "mobx";
import * as loading from "../toolbox/loading.js";
export class ScheduleModel {
    constructor(options) {
        this.events = {};
        Object.assign(this, options);
    }
    async handleAuthLoad(authLoad) {
        this.getAuthContext = loading.payload(authLoad)?.getAuthContext;
    }
    async loadEvent(name) {
        const event = await this.scheduleSentry.getEvent({ name });
        if (event)
            this.cacheEvent(name, event);
        return event;
    }
    async saveEvent(name, event) {
        const { accessToken } = await this.getAuthContext();
        await this.scheduleSentry.setEvent({ accessToken, name, event });
        this.cacheEvent(name, event);
    }
    cacheEvent(name, event) {
        this.events[name] = event;
    }
}
__decorate([
    observable
], ScheduleModel.prototype, "events", void 0);
__decorate([
    action.bound
], ScheduleModel.prototype, "handleAuthLoad", null);
__decorate([
    action.bound
], ScheduleModel.prototype, "loadEvent", null);
__decorate([
    action.bound
], ScheduleModel.prototype, "saveEvent", null);
//# sourceMappingURL=schedule-model.js.map