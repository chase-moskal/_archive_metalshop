import * as loading from "../toolbox/loading.js";
import { AuthPayload } from "../interfaces.js";
import { Logger } from "authoritarian/dist/toolbox/logger/interfaces.js";
import { SettingsSheriffTopic, Settings } from "authoritarian/dist/interfaces.js";
export declare class SettingsModel {
    settingsLoad: loading.Load<Settings>;
    get settings(): Settings;
    private logger;
    private settingsSheriff;
    private ticketbooth;
    private getAuthContext;
    constructor({ logger, settingsSheriff }: {
        logger: Logger;
        settingsSheriff: SettingsSheriffTopic;
    });
    private setSettingsLoad;
    setAdminMode(adminMode: boolean): Promise<void>;
    handleAuthLoad(authLoad: loading.Load<AuthPayload>): Promise<void>;
}
