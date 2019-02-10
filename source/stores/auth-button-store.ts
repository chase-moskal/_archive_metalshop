
import {observable, action} from "mobx"
import {AccessData} from "authoritarian/dist"

export class AuthButtonStore {
	@observable accessData: AccessData

	@action setAccessData(value: AccessData) {
		this.accessData = value
	}
}
