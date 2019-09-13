
export class UserLogoutEvent extends CustomEvent<{}> {
	static eventName = "user-logout"

	constructor() {
		super(UserLogoutEvent.eventName, {
			detail: {},
			bubbles: true,
			composed: true
		})
	}
}
