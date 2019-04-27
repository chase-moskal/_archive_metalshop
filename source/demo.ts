
import "menutown/source/register-all.js"
import "./register-all.js"

import {makeAuthMocks} from "./make-auth-mocks.js"
import {AuthIcon} from "./components/auth-icon.js"
import {AuthSlate} from "./components/auth-slate.js"
import {createAuthController} from "./controllers/create-auth-controller.js"

const menu: HTMLElement = document.querySelector("menu-system")
const authIcon: AuthIcon = document.querySelector("auth-icon")
const authSlate: AuthSlate = document.querySelector("auth-slate")

const authController = createAuthController({
	...makeAuthMocks({}),
	onStoreUpdate: () => {
		authIcon.requestUpdate()
		authSlate.requestUpdate()
	}
})

authIcon.store = authController.store
authSlate.store = authController.store

authController.passiveCheck()

menu.hidden = false
window["controller"] = authController
console.log("🤖")
