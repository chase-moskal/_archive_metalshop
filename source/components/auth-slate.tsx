
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthSlateStore} from "../stores/auth-slate-store"

@observer
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
		const {handleUserLogin, slateStore} = this.props
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
		const {handleUserLogout, slateStore} = this.props
		return (
			<div className="auth-slate loggedin">
				<p className="auth-user-name"><strong>{slateStore.accessData.name}</strong></p>
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
