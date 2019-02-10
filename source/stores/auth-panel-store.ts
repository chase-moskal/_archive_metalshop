
import {AccessData} from "authoritarian"
import {observable, action, autorun, computed} from "mobx"

import {AuthSlateStore} from "../stores/auth-slate-store"
import {AuthButtonStore} from "../stores/auth-button-store"

export class AuthPanelStore {
	@observable open: boolean = false
	@observable accessData: AccessData
	@observable slateStore: AuthSlateStore = new AuthSlateStore()
	@observable buttonStore: AuthButtonStore = new AuthButtonStore()

	@computed get loggedIn(): boolean {
		return !!this.accessData
	}

	constructor() {
		const {slateStore, buttonStore} = this

		// replicating changes into the slate store
		autorun(() => slateStore.setLoggedIn(this.loggedIn))
		autorun(() => slateStore.setAccessData(this.accessData))

		// replicating changes into the button store
		autorun(() => buttonStore.setAccessData(this.accessData))
	}

	@action toggleOpen(value?: boolean): boolean {
		if (value === undefined || value === null)
			this.open = !this.open
		else
			this.open = value
		return this.open
	}

	@action setAccessData(data: AccessData): void {
		this.accessData = data
	}
}
