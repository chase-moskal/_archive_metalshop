
import "menutown/dist/register-all.js"
import "./register-all.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"

import {
	MockAccountPopup,
	MockTokenStorage,
	MockProfileManager,
	MockPaywallGuardian,
} from "./mocks.js"

const userPanel: UserPanel = document.querySelector("user-panel")
const userButton: UserButton = document.querySelector("user-button")

async function main() {
	userPanel.accountPopup = new MockAccountPopup()
	userPanel.tokenStorage = new MockTokenStorage()
	userPanel.profileManager = new MockProfileManager()
	userPanel.paywallGuardian = new MockPaywallGuardian()
	await userPanel.startup()
}

main()
	.then(() => console.log("🤖"))
	.catch(error => console.error(error))
