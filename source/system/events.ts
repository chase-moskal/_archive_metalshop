
import {GetAuthContext} from "../interfaces.js"
import {Profile} from "authoritarian/dist/interfaces.js"

export class UserLogoutEvent extends CustomEvent<{}> {}
export class UserLoadingEvent extends CustomEvent<{}> {}
export class UserErrorEvent extends CustomEvent<{error: Error}> {}
export class UserLoginEvent extends CustomEvent<{getAuthContext: GetAuthContext}> {}

export class ProfileUpdateEvent extends CustomEvent<{profile: Profile}> {}
export class ProfileErrorEvent extends CustomEvent<{error: Error}> {}
