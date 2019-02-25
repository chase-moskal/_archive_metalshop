
import {h} from "preact"
import {MenuAccount} from "menutown"

import {AuthController} from "../interfaces"
import {AuthSlate} from "../components/auth-slate"

export function createAuthMenuAccount({
	authController
}: {authController: AuthController}): MenuAccount {

	const {authStore, logout, promptUserLogin} = authController

	const menuAccount: MenuAccount = {
		name: "auth",
		content: (
			<AuthSlate
				authStore={authStore}
				handleUserLogin={promptUserLogin}
				handleUserLogout={logout}>
			</AuthSlate>
		),
		buttonContent: (
			<div>auth</div>
		)
	}

	return menuAccount
}
