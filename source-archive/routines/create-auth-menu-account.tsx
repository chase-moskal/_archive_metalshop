
import {h} from "preact"
import {MenuAccount} from "menutown"

import {AuthController} from "../interfaces"
import {AuthSlate} from "../components/auth-slate"
import {AuthAvatar} from "../components/auth-avatar"

export function createAuthMenuAccount({authController}: {
	authController: AuthController
}): MenuAccount {
	const {authStore, logout, promptUserLogin} = authController

	const menuAccount: MenuAccount = {
		name: "auth",
		content: (
			<AuthSlate
				authStore={authStore}
				handleUserLogin={promptUserLogin}
				handleUserLogout={logout}/>
		),
		buttonContent: (
			<AuthAvatar authStore={authStore}/>
		)
	}

	return menuAccount
}
