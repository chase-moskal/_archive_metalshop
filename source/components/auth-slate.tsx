
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthLoginStore} from "../stores/create-login-store"

@observer
export class AuthSlate extends Component<{
	loginStore: AuthLoginStore
	handleUserLogin: () => void
	handleUserLogout: () => void
}> {

	render() {
		const {loginStore} = this.props
		return loginStore.loggedIn
			? this.renderSlateLoggedIn()
			: this.renderSlateLoggedOut()
	}

	private renderSlateLoggedOut() {
		const {handleUserLogin, loginStore} = this.props
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
		const {handleUserLogout, loginStore} = this.props
		return (
			<div className="auth-slate loggedin">
				<p className="auth-user-name">
					<strong>{loginStore.accessData.name}</strong>
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
