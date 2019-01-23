
import {observable, action, computed} from "mobx"

export default class AuthStore {
	@observable open: boolean = false
	@observable zToken: string

	@computed get loggedIn() {
		return !!this.zToken
	}

	@action toggleOpen(value?: boolean) {
		if (value === undefined) {
			this.open = !this.open
		}
		else {
			this.open = value
		}
	}

	@action setZToken(zToken: string) {
		this.zToken = zToken
	}
}
