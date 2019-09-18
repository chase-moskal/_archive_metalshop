
import {AuthContext, Profile} from "./interfaces.js"

export class UserLoginEvent extends CustomEvent<AuthContext> {}
export class UserLogoutEvent extends CustomEvent<{}> {}
export class ProfileLoadedEvent extends CustomEvent<Profile> {}
