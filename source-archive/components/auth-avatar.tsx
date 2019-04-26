
import {h} from "preact"
import {observer} from "mobx-preact"
import {AuthStore} from "../stores/auth-store"

export const AuthAvatar = observer(({authStore}: {authStore: AuthStore}) => (
	<div
		className="auth-avatar"
		data-logged-in={authStore.loggedIn}
		style={
			authStore.loggedIn
				? {backgroundImage: `url("${authStore.accessData.profilePicture}")`}
				: {}
		}>
	</div>
))
