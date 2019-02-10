
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
				data-logged-in={!!loginStore.accessData}
				onClick={this.props.handleButtonClick}
				style={
					!!loginStore.accessData
						? `background-image: url("${loginStore.accessData.profilePicture}")`
						: null
				}>
			</button>
		)
	}
}
