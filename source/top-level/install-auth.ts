
import {createAuthController} from "../controllers/create-auth-controller"

import {renderAuthSlate} from "./render-auth-slate"
import {AuthMachineFundamentals} from "../interfaces"

export function installAuth({
	element,
	tokenApi,
	loginApi,
	decodeAccessToken
}: AuthMachineFundamentals & {element: Element}) {

	const authController = createAuthController({
		tokenApi,
		loginApi,
		decodeAccessToken
	})

	const {authStore, logout, promptUserLogin} = authController

	renderAuthSlate({
		element,
		authStore,
		handleUserLogout: logout,
		handleUserLogin: promptUserLogin
	})

	return {authController}
}
