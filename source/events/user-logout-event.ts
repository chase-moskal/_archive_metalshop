
export class UserLogoutEvent extends CustomEvent<{}> {
	constructor() {
		super("user-login-event", {
			detail: {},
			bubbles: true,
			composed: true
		})
	}
}
