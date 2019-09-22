
import {AuthContext} from "./interfaces.js"
import {Profile} from "authoritarian/dist/interfaces.js"

export class UserLoginEvent extends CustomEvent<AuthContext> {}
export class UserLogoutEvent extends CustomEvent<{}> {}
export class ProfileLoadedEvent extends CustomEvent<Profile> {}
