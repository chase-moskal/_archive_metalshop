
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, action, autorun, computed} from "mobx"

import {AuthButton} from "./auth-button"
import {AuthSlate, AuthSlateStore} from "./auth-slate"

import {UserProfile} from "../interfaces"

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
				<AuthSlate {...{slateStore, handleUserLogin, handleUserLogout}}>
					{this.props.children}
				</AuthSlate>
			</div>
		)
	}

	private readonly handleButtonClick = () => this.props.panelStore.toggleOpen()
}
