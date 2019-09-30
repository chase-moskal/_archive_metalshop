var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { observable, action, computed } from "mobx";
import { makeTicketbooth } from "../toolbox/ticketbooth.js";
export class SettingsModel {
    constructor({ logger, settingsSheriff }) {
        this.settingsLoad = loading.load();
        this.ticketbooth = makeTicketbooth();
        this.getAuthContext = null;
        this.logger = logger;
        this.settingsSheriff = settingsSheriff;
    }
    get settings() { return loading.payload(this.settingsLoad); }
    setSettingsLoad(load) {
        this.settingsLoad = load;
    }
    async setAdminMode(adminMode) {
        try {
            this.setSettingsLoad(loading.loading());
            const { accessToken } = await this.getAuthContext();
            const settings = await this.settingsSheriff.setAdminMode({
                adminMode,
                accessToken,
            });
            this.setSettingsLoad(loading.ready(settings));
        }
        catch (error) {
            this.setSettingsLoad(loading.error());
            this.logger.error(error);
        }
    }
    async handleAuthLoad(authLoad) {
        const authPayload = loading.payload(authLoad);
        this.getAuthContext = authPayload?.getAuthContext || null;
        const loggedIn = !!authPayload?.user;
        if (loggedIn) {
            try {
                this.setSettingsLoad(loading.loading());
                const { accessToken } = await this.getAuthContext();
                const sessionStillValid = this.ticketbooth.pullSession();
                const settings = await this.settingsSheriff.fetchSettings({ accessToken });
                if (sessionStillValid()) {
                    this.setSettingsLoad(loading.ready(settings));
                    this.logger.debug("settings loaded");
                }
            }
            catch (error) {
                this.setSettingsLoad(loading.error());
                this.logger.error(error);
            }
        }
        else {
            this.setSettingsLoad(loading.none());
        }
    }
}
__decorate([
    observable
], SettingsModel.prototype, "settingsLoad", void 0);
__decorate([
    computed
], SettingsModel.prototype, "settings", null);
__decorate([
    action.bound
], SettingsModel.prototype, "setSettingsLoad", null);
__decorate([
    action.bound
], SettingsModel.prototype, "setAdminMode", null);
__decorate([
    action.bound
], SettingsModel.prototype, "handleAuthLoad", null);
//# sourceMappingURL=settings-model.js.map