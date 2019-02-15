
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthLoginStore} from "../stores/create-login-store"

@observer
export class AuthButton extends Component<{
	loginStore: AuthLoginStore
	handleButtonClick: () => void
}> {

	render() {
		const {loginStore} = this.props
		return (
			<button
				className="auth-button"
				tabIndex={0}
				data-logged-in={loginStore.loggedIn}
				onClick={this.props.handleButtonClick}
				style={
					loginStore.loggedIn
						? `background-image: url("${loginStore.accessData.profilePicture}")`
						: null
				}>
			</button>
		)
	}
}
