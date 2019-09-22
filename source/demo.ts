
import {TokenStorageTopic} from "authoritarian/dist/interfaces.js"

import "menutown/dist/register-all.js"
import "./register-all.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfileSubpanel} from "./components/profile-subpanel.js"
import {accountPopupLogin} from "./integrations/account-popup-login.js"
import {
	prepareTokenStorageClient
} from "./integrations/prepare-token-storage-client.js"

import {MockProfileManager} from "./mocks.js"

async function main() {
	const authServerOrigin = "http://localhost:8000"

	const userPanel: UserPanel = document.querySelector("user-panel")
	const userButton: UserButton = document.querySelector("user-button")
	const profileSubpanel: ProfileSubpanel = document.querySelector("profile-subpanel")
	const tokenStorage: TokenStorageTopic = await prepareTokenStorageClient(authServerOrigin)

	// console-log the events
	for (const event of ["user-login", "user-logout", "profile-loaded"])
		window.addEventListener(event, () => console.log(event))

	// attach mocks instead of real implementations
	userPanel.tokenStorage = tokenStorage
	userPanel.accountPopupLogin = accountPopupLogin
	profileSubpanel.profiler = new MockProfileManager()

	// schweet action!
	await userPanel.startup()
}

main()
	.then(() => console.log("🤖"))
	.catch(error => console.error(error))
