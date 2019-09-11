
import {UserProfile} from "../interfaces.js"

export class UserProfileLoadedEvent extends CustomEvent<UserProfile> {
	constructor(detail: UserProfile) {
		super("user-profile-loaded-event", {
			detail,
			bubbles: true,
			composed: true
		})
	}
}
