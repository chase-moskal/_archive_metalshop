var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { observable, action, computed } from "mobx";
import { makeTicketbooth } from "../toolbox/ticketbooth.js";
export class ProfileModel {
    constructor(options) {
        this.profileLoad = loading.load();
        this.ticketbooth = makeTicketbooth();
        this.getAuthContext = null;
        Object.assign(this, options);
    }
    get profile() { return loading.payload(this.profileLoad); }
    setProfileLoad(load) {
        this.profileLoad = load;
    }
    async saveProfile(profile) {
        const { accessToken } = await this.getAuthContext();
        await this.profileMagistrate.setProfile({ accessToken, profile });
        this.setProfileLoad(loading.ready(profile));
    }
    async handleAuthLoad(authLoad) {
        const authPayload = loading.payload(authLoad);
        this.getAuthContext = authPayload?.getAuthContext || null;
        const loggedIn = !!authPayload?.user;
        if (loggedIn) {
            try {
                this.setProfileLoad(loading.loading());
                const { user } = await this.getAuthContext();
                const { userId } = user;
                const sessionStillValid = this.ticketbooth.pullSession();
                const profile = await this.profileMagistrate.getProfile({ userId });
                if (sessionStillValid()) {
                    this.setProfileLoad(loading.ready(profile));
                    this.logger.debug("profile loaded");
                }
                else
                    this.logger.debug("profile discarded, outdated session");
            }
            catch (error) {
                this.setProfileLoad(loading.error("error loading profile"));
                throw error;
            }
        }
        else {
            this.setProfileLoad(loading.none());
        }
    }
}
__decorate([
    observable
], ProfileModel.prototype, "profileLoad", void 0);
__decorate([
    computed
], ProfileModel.prototype, "profile", null);
__decorate([
    action.bound
], ProfileModel.prototype, "setProfileLoad", null);
__decorate([
    action.bound
], ProfileModel.prototype, "saveProfile", null);
__decorate([
    action.bound
], ProfileModel.prototype, "handleAuthLoad", null);
//# sourceMappingURL=profile-model.js.map