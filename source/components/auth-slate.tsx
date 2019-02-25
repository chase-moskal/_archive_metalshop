
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthSlateProps} from "../interfaces"

@observer
export class AuthSlate extends Component<AuthSlateProps> {

	render() {
		const {authStore} = this.props
		return authStore.loggedIn
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
		const {handleUserLogout, authStore} = this.props
		return (
			<div className="auth-slate loggedin">
				<p className="auth-user-name">
					<strong>{authStore.accessData.name}</strong>
				</p>
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
