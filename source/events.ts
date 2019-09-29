
import {GetAuthContext} from "./interfaces.js"
import {Profile} from "authoritarian/dist/interfaces.js"

export class UserLoginEvent extends CustomEvent<{
	getAuthContext: GetAuthContext
}> {}

export class UserLogoutEvent extends CustomEvent<{}> {}

export class ProfileUpdateEvent extends CustomEvent<{
	profile: Profile
}> {}
