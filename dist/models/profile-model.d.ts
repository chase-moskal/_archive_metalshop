import * as loading from "../toolbox/loading.js";
import { AuthPayload } from "../interfaces.js";
import { Logger } from "authoritarian/dist/toolbox/logger/interfaces.js";
import { ProfileMagistrateTopic, Profile } from "authoritarian/dist/interfaces.js";
export declare class ProfileModel {
    profileLoad: loading.Load<Profile>;
    get profile(): Profile;
    private logger;
    private profileMagistrate;
    private ticketbooth;
    private getAuthContext;
    constructor(options: {
        logger: Logger;
        profileMagistrate: ProfileMagistrateTopic;
    });
    private setProfileLoad;
    saveProfile(profile: Profile): Promise<void>;
    handleAuthLoad(authLoad: loading.Load<AuthPayload>): Promise<void>;
}
