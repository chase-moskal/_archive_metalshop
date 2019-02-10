
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {AuthSlate} from "./auth-slate"
import {AuthButton} from "./auth-button"
import {AuthPanelProps} from "./interfaces"

@observer
export class AuthPanel extends Component<AuthPanelProps> {

	render() {
		const {handleButtonClick} = this
		const {panelStore, handleUserLogin, handleUserLogout} = this.props
		const {loginStore} = panelStore
		return (
			<div className="authoritarian auth-panel">
				<AuthButton {...{loginStore, handleButtonClick}}/>
				{panelStore.open
					? (
						<AuthSlate {...{loginStore, handleUserLogin, handleUserLogout}}>
							{this.props.children}
						</AuthSlate>
					)
					: null}
			</div>
		)
	}

	private readonly handleButtonClick = () => this.props.panelStore.toggleOpen()
}
