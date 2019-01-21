
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {AuthStore} from "source/stores/auth-store"

@observer
export class AuthSlate extends Component<{authStore: AuthStore}> {

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
