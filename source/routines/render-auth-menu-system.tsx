
import {h} from "preact"
import * as preact from "preact"
import {MenuSystem, MenuAccountant} from "menutown"

import {AuthMachineFundamentals} from "../interfaces"
import {createAuthController} from "../controllers/create-auth-controller"

import {createAuthMenuAccount} from "./create-auth-menu-account"

export function renderAuthMenuSystem({element, authFundamentals}: {
	element: Element
	authFundamentals: AuthMachineFundamentals
}) {
	const authController = createAuthController(authFundamentals)
	const menuAccount = createAuthMenuAccount({authController})
	const menuAccountant = new MenuAccountant({accounts: [menuAccount]})
	const ui = (
		<MenuSystem accountant={menuAccountant}></MenuSystem>
	)
	const newElement = preact.render(ui, null, element)
	return {authController, newElement, menuAccountant}
}
