
import {observable, action} from "mobx"
import {AccessData} from "../interfaces"

export class AuthSlateStore {
	@observable loggedIn: boolean
	@observable accessData: AccessData

	@action setLoggedIn(loggedIn: boolean) {
		this.loggedIn = loggedIn
	}

	@action setUserProfile(userProfile: AccessData) {
		this.accessData = userProfile
	}
}
