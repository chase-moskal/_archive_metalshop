
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {AuthSlate} from "./auth-slate"
import {AuthButton} from "./auth-button"
import {AuthMachine} from "source/stores/auth-machine"

@observer
export class AuthPanel extends Component<{authMachine: AuthMachine}> {
	render() {
		const {authMachine} = this.props
		const {authStore} = authMachine
		return (
			<div className="authoritarian auth-panel">
				<AuthButton {...{authStore}}/>
				<AuthSlate {...{authStore}}/>
			</div>
		)
	}
}
