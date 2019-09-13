
import {Profile} from "../interfaces.js"

export class ProfileLoadedEvent extends CustomEvent<Profile> {
	static eventName = "profile-loaded"

	constructor(detail: Profile) {
		super(ProfileLoadedEvent.eventName, {
			detail,
			bubbles: true,
			composed: true
		})
	}
}
