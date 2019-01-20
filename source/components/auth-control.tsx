
import {h, Component} from "preact"
import {AuthStore} from "../stores/auth-store"

export class AuthControl extends Component<{store: AuthStore}> {
	render() {
		return (
			<div class="authoritarian auth-control">
				<div></div>
			</div>
		)
	}
}
