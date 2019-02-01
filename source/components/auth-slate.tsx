
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import AuthMachine from "../modules/auth-machine"

@observer
export default class AuthSlate extends Component<{authMachine: AuthMachine}> {

	render() {
		const {authStore} = this.props.authMachine

		if (authStore.open) {
			return authStore.loggedIn
				? this.renderSlateLoggedIn()
				: this.renderSlateLoggedOut()
		}
		else {
			return null
		}
	}

	private handleClickLoginButton = async() => {
		const {authMachine} = this.props
		await authMachine.auth()
	}

	private renderSlateLoggedOut() {
		const {handleClickLoginButton} = this
		return (
			<div className="auth-slate loggedout">
				<button
					className="auth-login-button"
					onClick={handleClickLoginButton}>
						Login
				</button>
			</div>
		)
	}

	private renderSlateLoggedIn() {
		return (
			<div className="auth-slate loggedin">
				(button to sign out)
			</div>
		)
	}
}
