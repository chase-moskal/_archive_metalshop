
import {observable, action} from "mobx"
import {AccessData} from "../auth-machinery/interfaces"

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
