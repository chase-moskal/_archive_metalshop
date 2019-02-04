
import {AccessData} from "authoritarian"

import {observable, action} from "mobx"

export class AuthSlateStore {
	@observable loggedIn: boolean
	@observable accessData: AccessData

	@action setLoggedIn(loggedIn: boolean) {
		this.loggedIn = loggedIn
	}

	@action setAccessData(accessData: AccessData) {
		this.accessData = accessData
	}
}
