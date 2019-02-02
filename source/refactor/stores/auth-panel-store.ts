
import {observable, action, autorun, computed} from "mobx"

import {AccessData} from "../interfaces"
import {consoleCurry} from "../console-curry"
import {AuthSlateStore} from "../stores/auth-slate-store"
import {AuthButtonStore} from "../stores/auth-button-store"

const info = consoleCurry({
	tag: "auth-panel-store",
	consoleFunction: console.info
})

export class AuthPanelStore {
	@observable open: boolean = false
	@observable userProfile: AccessData
	@observable slateStore: AuthSlateStore = new AuthSlateStore()
	@observable buttonStore: AuthButtonStore = new AuthButtonStore()

	@computed get loggedIn(): boolean {
		return !!this.userProfile
	}

	constructor() {
		const {slateStore} = this

		// replicating changes into the slate store
		autorun(() => slateStore.setLoggedIn(this.loggedIn))
		autorun(() => slateStore.setUserProfile(this.userProfile))

		// log whenever user logs in or out
		autorun(() => {
			const {userProfile} = slateStore
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

	@action setUserProfile(userProfile: AccessData): void {
		this.userProfile = userProfile
	}
}
