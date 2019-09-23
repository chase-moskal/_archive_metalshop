
import "menutown/dist/register-all.js"
import "./register-all.js"

import {TokenStorageTopic, ProfilerTopic} from "authoritarian/dist/interfaces.js"
import {
	createTokenStorageCrosscallClient,
	createProfilerCacheCrosscallClient
} from "authoritarian/dist/clients.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfileSubpanel} from "./components/profile-subpanel.js"
import {accountPopupLogin} from "./integrations/account-popup-login.js"

async function main() {
	const userPanel: UserPanel = document.querySelector("user-panel")
	const userButton: UserButton = document.querySelector("user-button")
	const profileSubpanel: ProfileSubpanel = document.querySelector("profile-subpanel")

	const tokenStorage: TokenStorageTopic = await createTokenStorageCrosscallClient({
		url: "http://localhost:8000/html/token-storage"
	})

	const profiler: ProfilerTopic = await createProfilerCacheCrosscallClient({
		url: "http://localhost:8001/html/profiler-cache"
	})

	// console-log the events
	for (const event of ["user-login", "user-logout", "profile-loaded"])
		window.addEventListener(event, () => console.log(event))

	// attach mocks instead of real implementations
	profileSubpanel.profiler = profiler
	userPanel.tokenStorage = tokenStorage
	userPanel.accountPopupLogin = accountPopupLogin

	// schweet action!
	await userPanel.startup()
}

main()
	.then(() => console.log("🤖"))
	.catch(error => console.error(error))
