
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthButtonStore} from "../stores/auth-button-store"

@observer
export class AuthButton extends Component<{
	buttonStore: AuthButtonStore
	handleButtonClick: () => void
}> {

	render() {
		const {buttonStore} = this.props
		return (
			<button
				className="auth-button"
				tabIndex={0}
				data-logged-in={!!buttonStore.accessData}
				onClick={this.props.handleButtonClick}
				style={
					!!buttonStore.accessData
						? `background-image: url("${buttonStore.accessData.profilePicture}")`
						: null
				}>
			</button>
		)
	}
}
