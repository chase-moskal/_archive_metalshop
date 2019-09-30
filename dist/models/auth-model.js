var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, action } from "mobx";
import * as loading from "../toolbox/loading.js";
export class AuthModel {
    constructor(options) {
        //
        // public observables
        //
        this.user = null;
        this.getAuthContext = null;
        this.authLoad = loading.load();
        Object.assign(this, options);
    }
    //
    // public functions
    //
    async useExistingLogin() {
        this.setLoading();
        try {
            const accessToken = await this.tokenStore.passiveCheck();
            if (accessToken) {
                const detail = this.processAccessToken(accessToken);
                this.setLoggedIn(detail);
            }
            else
                this.setLoggedOut();
        }
        catch (error) {
            this.setError(error);
        }
    }
    async loginWithAccessToken(accessToken) {
        await this.tokenStore.writeAccessToken(accessToken);
        if (accessToken) {
            const payload = this.processAccessToken(accessToken);
            this.setLoggedIn(payload);
        }
        else {
            this.setLoggedOut();
        }
    }
    async login() {
        this.setLoading();
        try {
            const authTokens = await this.triggerAccountPopup();
            await this.tokenStore.writeTokens(authTokens);
            const payload = this.processAccessToken(authTokens.accessToken);
            this.setLoggedIn(payload);
        }
        catch (error) {
            console.error(error);
        }
    }
    async logout() {
        this.setLoading();
        try {
            await this.tokenStore.clearTokens();
            this.authContext = null;
            this.setLoggedOut();
        }
        catch (error) {
            this.setError(error);
        }
    }
    async reauthorize() {
        this.setLoading();
        try {
            await this.tokenStore.writeAccessToken(null);
            this.authContext = null;
            await this.useExistingLogin();
        }
        catch (error) {
            this.setError(error);
        }
    }
    //
    // private methods
    //
    processAccessToken(accessToken) {
        this.authContext = this.decodeAccessToken(accessToken);
        this.user = this.authContext?.user;
        const getAuthContext = async () => {
            const gracedExp = (this.authContext.exp - this.expiryGraceSeconds);
            const expired = gracedExp < (Date.now() / 1000);
            if (expired) {
                const accessToken = await this.tokenStore.passiveCheck();
                this.authContext = this.decodeAccessToken(accessToken);
                this.user = this.authContext?.user;
            }
            return this.authContext;
        };
        return { getAuthContext, user: this.user };
    }
    setError(error) {
        this.user = null;
        this.getAuthContext = null;
        this.authLoad = loading.error(undefined);
        console.error(error);
    }
    setLoading() {
        this.user = null;
        this.getAuthContext = null;
        this.authLoad = loading.loading();
    }
    setLoggedIn({ user, getAuthContext }) {
        this.getAuthContext = getAuthContext;
        this.authLoad = loading.ready({ user, getAuthContext });
    }
    setLoggedOut() {
        this.user = null;
        this.getAuthContext = null;
        this.authLoad = loading.ready({ user: null, getAuthContext: null });
    }
}
__decorate([
    observable
], AuthModel.prototype, "user", void 0);
__decorate([
    observable
], AuthModel.prototype, "getAuthContext", void 0);
__decorate([
    observable
], AuthModel.prototype, "authLoad", void 0);
__decorate([
    action.bound
], AuthModel.prototype, "useExistingLogin", null);
__decorate([
    action.bound
], AuthModel.prototype, "loginWithAccessToken", null);
__decorate([
    action.bound
], AuthModel.prototype, "login", null);
__decorate([
    action.bound
], AuthModel.prototype, "logout", null);
__decorate([
    action.bound
], AuthModel.prototype, "reauthorize", null);
__decorate([
    action.bound
], AuthModel.prototype, "processAccessToken", null);
__decorate([
    action.bound
], AuthModel.prototype, "setError", null);
__decorate([
    action.bound
], AuthModel.prototype, "setLoading", null);
__decorate([
    action.bound
], AuthModel.prototype, "setLoggedIn", null);
__decorate([
    action.bound
], AuthModel.prototype, "setLoggedOut", null);
// // reimagined in functional style...
// export function makeAuthModel({
// 		tokenStore,
// 		decodeAccessToken,
// 		expiryGraceSeconds,
// 		triggerAccountPopup,
// 	}: {
// 		expiryGraceSeconds: number
// 		tokenStore: TokenStoreTopic
// 		decodeAccessToken: DecodeAccessToken
// 		triggerAccountPopup: TriggerAccountPopup
// 	}) {
// 	const observables = observelize({
// 		user: <User>null,
// 		getAuthContext: <GetAuthContext>null,
// 		authLoad: loading.load<AuthPayload>(),
// 	})
// 	const privateActions = actionelize({
// 		processAccessToken() {},
// 		setError() {},
// 		setLoading() {},
// 		setLoggedIn() {},
// 		setLoggedOut() {},
// 	})
// 	const actions = actionelize({
// 		async login() {},
// 		async logout() {},
// 		async useExistingLogin() {},
// 		async loginWithAccessToken() {},
// 	})
// 	return {observables, actions}
// }
//# sourceMappingURL=auth-model.js.map