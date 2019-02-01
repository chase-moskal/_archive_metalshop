
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthStoreShape} from "../interfaces"

@observer
export default class AuthSlate extends Component<{
	authStore: AuthStoreShape
	userClickLogin: () => void
	userClickLogout: () => void
}> {

	render() {
		const {authStore} = this.props
		if (authStore.open) {
			return authStore.loggedIn
				? this.renderSlateLoggedIn()
				: this.renderSlateLoggedOut()
		}
		else {
			return null
		}
	}

	private renderSlateLoggedOut() {
		const {userClickLogin} = this.props
		return (
			<div className="auth-slate loggedout">
				<button
					className="auth-login-button"
					onClick={userClickLogin}>
						Login
				</button>
			</div>
		)
	}

	private renderSlateLoggedIn() {
		const {userClickLogout} = this.props
		return (
			<div className="auth-slate loggedin">
				<button
					className="auth-login-button"
					onClick={userClickLogout}>
						Login
				</button>
			</div>
		)
	}
}
