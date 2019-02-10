
import {AccessData} from "authoritarian"
import {observable, action, autorun, computed, runInAction} from "mobx"

import {createLoginStore, AuthLoginStore} from "./create-login-store"

export class AuthPanelStore {
	@observable open: boolean
	@observable accessData: AccessData
	@observable loginStore: AuthLoginStore

	@computed get loggedIn(): boolean {
		return !!this.accessData
	}

	constructor() {

		// create login store and replicate access data
		const {loginStore, setAccessData} = createLoginStore()
		runInAction(() => this.loginStore = loginStore)
		autorun(() => setAccessData(this.accessData))

		// start closed
		this.toggleOpen(false)
	}

	@action toggleOpen(value?: boolean): boolean {
		const valueIsProvided = value !== undefined && value !== null
		const open = valueIsProvided ? value : !this.open
		this.open = open
		return open
	}

	@action setAccessData(data: AccessData): void {
		this.accessData = data
	}
}
