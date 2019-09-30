var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { pubsub } from "../toolbox/pubsub.js";
import * as loading from "../toolbox/loading.js";
import { observable, action, runInAction } from "mobx";
import { PrivilegeLevel } from "../interfaces.js";
/**
 * System-level liveshow state
 */
export class LiveshowModel {
    constructor(options) {
        //
        // pubsub to mirror auth load to view models
        //
        this.authLoadPubsub = pubsub();
        //
        // function to create new view models
        //
        this.makeViewModel = ({ videoName }) => {
            const { liveshowGovernor } = this;
            const viewModel = new LiveshowViewModel({
                videoName,
                liveshowGovernor,
            });
            const dispose = this.authLoadPubsub.subscribe(viewModel.handleAuthLoad);
            return {
                dispose,
                viewModel,
            };
        };
        Object.assign(this, options);
    }
    handleAuthLoad(authLoad) {
        this.authLoadPubsub.publish(authLoad);
    }
    dispose() {
        this.authLoadPubsub.dispose();
    }
}
/**
 * Component-level liveshow state
 */
export class LiveshowViewModel {
    constructor(options) {
        //
        // public observables
        //
        this.validationMessage = null;
        this.videoLoad = loading.load();
        this.privilege = PrivilegeLevel.Unknown;
        Object.assign(this, options);
    }
    //
    // public actions
    //
    ascertainPrivilege(user) {
        return user.claims.admin
            ? PrivilegeLevel.Privileged
            : user.claims.premium
                ? PrivilegeLevel.Privileged
                : PrivilegeLevel.Unprivileged;
    }
    async handleAuthLoad(authLoad) {
        // initialize observables
        this.videoLoad = loading.none();
        this.privilege = PrivilegeLevel.Unknown;
        // setup variables
        this.getAuthContext = null;
        const authIsReady = loading.isReady(authLoad);
        const getAuthContext = loading.payload(authLoad)?.getAuthContext;
        const userIsLoggedIn = !!getAuthContext;
        // logic for privileges and loading the video
        if (authIsReady) {
            if (userIsLoggedIn) {
                this.getAuthContext = getAuthContext;
                const { user, accessToken } = await getAuthContext();
                // set privilege level
                const privilege = this.ascertainPrivilege(user);
                runInAction(() => this.privilege = privilege);
                // load video
                if (privilege === PrivilegeLevel.Privileged) {
                    runInAction(() => this.videoLoad = loading.loading());
                    const { vimeoId } = await this.loadVideo(accessToken);
                    runInAction(() => this.videoLoad = loading.ready({
                        vimeoId
                    }));
                }
            }
            else
                this.privilege = PrivilegeLevel.Unprivileged;
        }
    }
    async updateVideo(vimeostring) {
        vimeostring = vimeostring.trim();
        this.validationMessage = null;
        let vimeoId;
        {
            const idParse = /^\d{5,}$/i.exec(vimeostring);
            const linkParse = /vimeo\.com\/(\d{5,})/i.exec(vimeostring);
            if (idParse) {
                vimeoId = vimeostring;
            }
            else if (linkParse) {
                vimeoId = linkParse[1];
            }
        }
        if (vimeoId || vimeostring === "") {
            const { videoName, getAuthContext } = this;
            const { accessToken } = await getAuthContext();
            await this.liveshowGovernor.setShow({
                vimeoId,
                videoName,
                accessToken,
            });
        }
        else {
            this.validationMessage = "invalid vimeo link or id";
        }
    }
    //
    // private functionality
    //
    async loadVideo(accessToken) {
        return await this.liveshowGovernor.getShow({
            accessToken,
            videoName: this.videoName,
        });
    }
}
__decorate([
    observable
], LiveshowViewModel.prototype, "validationMessage", void 0);
__decorate([
    observable
], LiveshowViewModel.prototype, "videoLoad", void 0);
__decorate([
    observable
], LiveshowViewModel.prototype, "privilege", void 0);
__decorate([
    action.bound
], LiveshowViewModel.prototype, "ascertainPrivilege", null);
__decorate([
    action.bound
], LiveshowViewModel.prototype, "handleAuthLoad", null);
__decorate([
    action.bound
], LiveshowViewModel.prototype, "updateVideo", null);
__decorate([
    action.bound
], LiveshowViewModel.prototype, "loadVideo", null);
//# sourceMappingURL=liveshow-model.js.map