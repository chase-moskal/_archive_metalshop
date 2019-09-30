import * as loading from "../toolbox/loading.js";
import { AuthPayload } from "../interfaces.js";
import { ScheduleSentryTopic, ScheduleEvent } from "authoritarian/dist/interfaces.js";
export declare class ScheduleModel {
    events: {
        [name: string]: ScheduleEvent;
    };
    private getAuthContext;
    private scheduleSentry;
    constructor(options: {
        scheduleSentry: ScheduleSentryTopic;
    });
    handleAuthLoad(authLoad: loading.Load<AuthPayload>): Promise<void>;
    loadEvent(name: string): Promise<ScheduleEvent>;
    saveEvent(name: string, event: ScheduleEvent): Promise<void>;
    private cacheEvent;
}
