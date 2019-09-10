
import {UserLoginDetail} from "../interfaces.js"

export class UserLoginEvent extends CustomEvent<UserLoginDetail> {
	constructor(detail: UserLoginDetail) {
		super("user-login-event", {
			detail,
			bubbles: true,
			composed: true
		})
	}
}
