
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

const userPanel: UserPanel = document.querySelector("user-panel")
const userButton: UserButton = document.querySelector("user-button")
const profileSubpanel: ProfileSubpanel = document.querySelector("profile-subpanel")

async function main() {
	userPanel.accountPopup = new MockAccountPopup()
	userPanel.tokenStorage = new MockTokenStorage()
	profileSubpanel.profileManager = new MockProfileManager()
	// userPanel.paywallGuardian = new MockPaywallGuardian()
	await userPanel.startup()
}

main()
	.then(() => console.log("🤖"))
	.catch(error => console.error(error))
