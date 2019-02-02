
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, action, autorun, computed} from "mobx"

import {AuthButton} from "./auth-button"
import {AuthSlate, AuthSlateStore} from "./auth-slate"

import {UserProfile} from "../interfaces"
import {consoleCurry} from "../console-curry"

const info = consoleCurry({
	tag: "auth-panel",
	consoleFunction: console.info
})

export class AuthPanelStore {
	@observable open: boolean = false
	@observable userProfile: UserProfile
	@observable slateStore: AuthSlateStore = new AuthSlateStore()

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

	@action setUserProfile(userProfile: UserProfile): void {
		this.userProfile = userProfile
	}
}

@observer
export class AuthPanel extends Component<{
	panelStore: AuthPanelStore
	handleUserLogin: () => void
	handleUserLogout: () => void
}> {

	render() {
		const {panelStore, handleUserLogin, handleUserLogout} = this.props
		const {slateStore} = panelStore
		return (
			<div className="authoritarian auth-panel">
				<AuthButton handleClick={this.handleButtonClick}/>
				{panelStore.open
					? (
						<AuthSlate {...{slateStore, handleUserLogin, handleUserLogout}}>
							{this.props.children}
						</AuthSlate>
					)
					: null}
			</div>
		)
	}

	private readonly handleButtonClick = () => this.props.panelStore.toggleOpen()
}
