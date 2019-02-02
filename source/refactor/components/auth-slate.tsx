
import {h, Component} from "preact"
import {observable, action} from "mobx"

import {UserProfile} from "../interfaces"

export class AuthSlateStore {
	@observable loggedIn: boolean
	@observable userProfile: UserProfile

	@action setLoggedIn(loggedIn: boolean) {
		this.loggedIn = loggedIn
	}

	@action setUserProfile(userProfile: UserProfile) {
		this.userProfile = userProfile
	}
}

export class AuthSlate extends Component<{
	slateStore: AuthSlateStore
	handleUserLogin: () => void
	handleUserLogout: () => void
}> {

	render() {
		const {slateStore} = this.props
		return slateStore.loggedIn
			? this.renderSlateLoggedIn()
			: this.renderSlateLoggedOut()
	}

	private renderSlateLoggedOut() {
		const {handleUserLogin} = this.props
		return (
			<div className="auth-slate loggedout">
				<button
					className="auth-login-button"
					onClick={handleUserLogin}>
						Login
				</button>
			</div>
		)
	}

	private renderSlateLoggedIn() {
		const {handleUserLogout} = this.props
		return (
			<div className="auth-slate loggedin">
				<button
					className="auth-logout-button"
					onClick={handleUserLogout}>
						Logout
				</button>
				{this.props.children}
			</div>
		)
	}
}
