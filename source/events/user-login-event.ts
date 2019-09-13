
import {AuthContext} from "../interfaces.js"

export class UserLoginEvent extends CustomEvent<AuthContext> {
	static eventName = "user-login"

	constructor(detail: AuthContext) {
		super(UserLoginEvent.eventName, {
			detail,
			bubbles: true,
			composed: true
		})
	}
}
