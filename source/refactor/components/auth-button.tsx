
import {h, Component} from "preact"
import {observer} from "mobx-preact"

@observer
export class AuthButton extends Component<{
	handleClick: () => void
}> {

	render() {
		return (
			<button
				className="auth-button"
				tabIndex={0}
				onClick={this.props.handleClick}>
			</button>
		)
	}
}
