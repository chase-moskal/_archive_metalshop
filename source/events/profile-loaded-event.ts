
import {Profile} from "../interfaces.js"

export class ProfileLoadedEvent extends CustomEvent<Profile> {
	constructor(detail: Profile) {
		super("profile-loaded", {
			detail,
			bubbles: true,
			composed: true
		})
	}
}
