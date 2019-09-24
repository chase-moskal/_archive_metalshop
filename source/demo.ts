
import "menutown/dist/register-all.js"
import "./register-all.js"

import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfilePanel} from "./components/profile-panel.js"

import {
	MockProfiler,
	MockTokenStorage,
	mockAccountPopupLogin,
	mockDecodeAccessToken,
} from "./mocks.js"

// console-log the events
for (const event of ["user-login", "user-logout", "profile-loaded"])
	window.addEventListener(event, () => console.log(event))

// use mocks in "?mock" mode
if (location.search.includes("mock") || location.hash.includes("mock")) {
	const userPanel: UserPanel = document.querySelector("user-panel")
	const userButton: UserButton = document.querySelector("user-button")
	const profilePanel: ProfilePanel = document.querySelector("profile-panel")
	userPanel.configure({
		tokenStorage: new MockTokenStorage(),
		accountPopupLogin: mockAccountPopupLogin,
		decodeAccessToken: mockDecodeAccessToken
	})
	profilePanel.configure({
		profiler: new MockProfiler()
	})
}
