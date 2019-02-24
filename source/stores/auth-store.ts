
import {AccessData} from "authoritarian"
import {observable, action, computed} from "mobx"

import {SetAccessData} from "../interfaces"

export class AuthStore {
	static create() {
		const authStore = new AuthStore()
		const setAccessData: SetAccessData = action((accessData: AccessData) => {
			authStore.accessData = accessData
		})
		return {authStore, setAccessData}
	}

	@observable accessData: AccessData

	@computed get loggedIn(): boolean {
		return !!this.accessData
	}
}
