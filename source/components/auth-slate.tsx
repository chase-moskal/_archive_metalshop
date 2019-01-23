
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

	private renderSlateLoggedOut() {
		return (
			<div className="auth-slate loggedout">
				(button to sign in)
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
