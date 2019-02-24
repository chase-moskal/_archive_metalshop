
import {h} from "preact"
import * as preact from "preact"

import {MenuSystem, MenuAccountant} from "menutown"

import {AuthSlate} from "../components/auth-slate"
import {AuthMachineFundamentals} from "../interfaces"
import {createAuthController} from "../controllers/create-auth-controller"

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

	const ui = (
		<MenuSystem accountant={new MenuAccountant({
			accounts: [
				{
					name: "auth",
					content: (
						<AuthSlate
							authStore={authStore}
							handleUserLogin={promptUserLogin}
							handleUserLogout={logout}>
						</AuthSlate>
					)
				}
			]
		})}>
		</MenuSystem>
	)
	preact.render(ui, null, element)
	return {authController}
}
