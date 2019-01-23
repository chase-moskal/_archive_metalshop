
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import AuthSlate from "./auth-slate"
import AuthButton from "./auth-button"

import AuthMachine from "../modules/auth-machine"

@observer
export default class AuthPanel extends Component<{authMachine: AuthMachine}> {
	render() {
		const {authMachine} = this.props
		const {authStore} = authMachine
		return (
			<div className="authoritarian auth-panel">
				<AuthButton {...{authStore}}/>
				<AuthSlate {...{authMachine}}/>
			</div>
		)
	}
}
