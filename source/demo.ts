
import "menutown/dist/register-all.js"
import "./register-all.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfileSubpanel} from "./components/profile-subpanel.js"

import {
	MockAccountPopup,
	MockTokenStorage,
	MockProfileManager,
	MockPaywallGuardian,
} from "./mocks.js"

async function main() {
	const userPanel: UserPanel = document.querySelector("user-panel")
	const userButton: UserButton = document.querySelector("user-button")
	const profileSubpanel: ProfileSubpanel = document.querySelector("profile-subpanel")

	// console-log the events
	for (const event of ["user-login", "user-logout", "profile-loaded"])
		window.addEventListener(event, () => console.log(event))

	// attach mocks instead of real implementations
	userPanel.accountPopup = new MockAccountPopup()
	userPanel.tokenStorage = new MockTokenStorage()
	profileSubpanel.profileManager = new MockProfileManager()

	// schweet action!
	await userPanel.startup()
}

main()
	.then(() => console.log("🤖"))
	.catch(error => console.error(error))
