import { GetAuthContext } from "../interfaces.js";
import { Profile } from "authoritarian/dist/interfaces.js";
export declare class UserLogoutEvent extends CustomEvent<{}> {
}
export declare class UserLoadingEvent extends CustomEvent<{}> {
}
export declare class UserErrorEvent extends CustomEvent<{
    error: Error;
}> {
}
export declare class UserLoginEvent extends CustomEvent<{
    getAuthContext: GetAuthContext;
}> {
}
export declare class ProfileUpdateEvent extends CustomEvent<{
    profile: Profile;
}> {
}
export declare class ProfileErrorEvent extends CustomEvent<{
    error: Error;
}> {
}
