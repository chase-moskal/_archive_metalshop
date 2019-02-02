
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthButtonStore} from "../stores/auth-button-store"

@observer
export class AuthButton extends Component<{
	buttonStore: AuthButtonStore
	handleButtonClick: () => void
}> {

	render() {
		return (
			<button
				className="auth-button"
				tabIndex={0}
				onClick={this.props.handleButtonClick}>
			</button>
		)
	}
}
