
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthStoreShape} from "../interfaces"

@observer
export default class AuthButton extends Component<{authStore: AuthStoreShape}> {

	render() {
		return (
			<button
				className="auth-button"
				tabIndex={0}
				onClick={this.handleClick}>
			</button>
		)
	}

	private readonly handleClick = () => this.props.authStore.toggleOpen()
}
