
import "menutown/source/components/menu-system.js"
import "menutown/source/components/menu-display.js"

import "./components/auth-icon.js"
import "./components/auth-slate.js"

import {createAuthController} from "./controllers/create-auth-controller.js"
import {makeAuthMocks} from "./make-auth-mocks.js"

const menu: HTMLElement = document.querySelector("menu-system")

menu.hidden = false

window["controller"] = createAuthController({
	...makeAuthMocks({}),
	onStoreUpdate: () => {
		console.log("store update!")
	}
})

console.log("🤖")
