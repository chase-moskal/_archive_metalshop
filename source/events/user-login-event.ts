
import {AuthContext} from "../interfaces.js"

export class UserLoginEvent extends CustomEvent<AuthContext> {
	constructor(detail: AuthContext) {
		super("user-login-event", {
			detail,
			bubbles: true,
			composed: true
		})
	}
}
