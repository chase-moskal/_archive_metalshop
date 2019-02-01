
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import AuthSlate from "./auth-slate"
import AuthButton from "./auth-button"

import {AuthStoreShape} from "../interfaces"

@observer
export default class AuthPanel extends Component<{
	authStore: AuthStoreShape
	userClickLogin: () => void
	userClickLogout: () => void
}> {
	render() {
		const {authStore, userClickLogin, userClickLogout} = this.props
		return (
			<div className="authoritarian auth-panel">
				<AuthButton {...{authStore}}/>
				<AuthSlate {...{authStore, userClickLogin, userClickLogout}}/>
			</div>
		)
	}
}
