
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {AuthMachine} from "../stores/auth-machine"

export class AuthControl extends Component<{store: AuthMachine}> {

	private renderLoggedOut() {
		return (
			<div class="panel loggedout">
				<div id="g-sign-in"></div>
			</div>
		)
	}

	private renderLoggedIn() {
		return (
			<div class="panel loggedin">
				
			</div>
		)
	}

	componentDidMount() {
		gapi.signin2.render(
			"g-sign-in",
			{
				scope: "profile email",

			}
		)
	}

	render() {
		return (
			<div class="authoritarian auth-control">

			</div>
		)
	}
}
