import * as loading from "../toolbox/loading.js";
import { User, AccessToken, TokenStoreTopic } from "authoritarian/dist/interfaces.js";
import { AuthPayload, TriggerAccountPopup, DecodeAccessToken, GetAuthContext } from "../interfaces.js";
export declare class AuthModel {
    user: User;
    getAuthContext: GetAuthContext;
    authLoad: loading.Load<AuthPayload>;
    private authContext;
    private expiryGraceSeconds;
    private tokenStore;
    private decodeAccessToken;
    private triggerAccountPopup;
    constructor(options: {
        expiryGraceSeconds: number;
        tokenStore: TokenStoreTopic;
        decodeAccessToken: DecodeAccessToken;
        triggerAccountPopup: TriggerAccountPopup;
    });
    useExistingLogin(): Promise<void>;
    loginWithAccessToken(accessToken: AccessToken): Promise<void>;
    login(): Promise<void>;
    logout(): Promise<void>;
    reauthorize(): Promise<void>;
    private processAccessToken;
    private setError;
    private setLoading;
    private setLoggedIn;
    private setLoggedOut;
}
