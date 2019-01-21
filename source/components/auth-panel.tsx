
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {AuthMachine} from "../stores/auth-machine"

@observer
export class AuthPanel extends Component<{authMachine: AuthMachine}> {

	private renderButton() {
		return (
			<div className="auth-button"></div>
		)
	}

	private renderSlateLoggedOut() {
		return (
			<div className="auth-panel loggedout">
				(button to sign in)
			</div>
		)
	}

	private renderSlateLoggedIn() {
		return (
			<div className="auth-slatepanel loggedin">
				(button to sign out)
			</div>
		)
	}

	render() {
		const {authMachine} = this.props
		return (
			<div className="authoritarian auth-panel">
				{this.renderButton}
				{authMachine.loggedIn
					? this.renderSlateLoggedIn()
					: this.renderSlateLoggedOut()}
			</div>
		)
	}
}
