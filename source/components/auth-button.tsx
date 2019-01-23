
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import AuthStore from "../stores/auth-store"

@observer
export default class AuthButton extends Component<{authStore: AuthStore}> {

	render() {
		return (
			<button
				className="auth-button"
				tabIndex={0}
				onClick={this.handleClick}
				>
			</button>
		)
	}

	private readonly handleClick = () => this.props.authStore.toggleOpen()
}
