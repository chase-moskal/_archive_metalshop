
import {AccessData} from "authoritarian"
import {observable, action, computed} from "mobx"

export interface AuthLoginStore {
	loggedIn: boolean
	accessData: AccessData
}

class LoginStore implements AuthLoginStore {
	@observable accessData: AccessData
	@computed get loggedIn(): boolean {
		return !!this.accessData
	}
}

export function createLoginStore(): {
	loginStore: AuthLoginStore
	setAccessData: (data: AccessData) => void
} {

	const loginStore = new LoginStore()
	const setAccessData = action("setAccessData", (data: AccessData) => {
		loginStore.accessData = data
	})

	return {
		loginStore,
		setAccessData
	}
}
