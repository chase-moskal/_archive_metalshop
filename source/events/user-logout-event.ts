
export class UserLogoutEvent extends CustomEvent<{}> {
	constructor() {
		super("user-logout", {
			detail: {},
			bubbles: true,
			composed: true
		})
	}
}
