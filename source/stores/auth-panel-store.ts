
import {observable, action, autorun, computed} from "mobx"

import {consoleCurry} from "../console-curry"
import {AccessData} from "../auth-machinery/interfaces"
import {AuthSlateStore} from "../stores/auth-slate-store"
import {AuthButtonStore} from "../stores/auth-button-store"

const info = consoleCurry({
	tag: "auth-panel-store",
	consoleFunction: console.info
})

export class AuthPanelStore {
	@observable open: boolean = false
	@observable accessData: AccessData
	@observable slateStore: AuthSlateStore = new AuthSlateStore()
	@observable buttonStore: AuthButtonStore = new AuthButtonStore()

	@computed get loggedIn(): boolean {
		return !!this.accessData
	}

	constructor() {
		const {slateStore} = this

		// replicating changes into the slate store
		autorun(() => slateStore.setLoggedIn(this.loggedIn))
		autorun(() => slateStore.setUserProfile(this.accessData))

		// log whenever user logs in or out
		autorun(() => {
			const {accessData: userProfile} = slateStore
			if (userProfile) info(`logged in as "${userProfile.name}"`)
			else info(`logged out`)
		})
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
