
import "menutown/dist/register-all.js"
import "./register-all.js"

import {authoritarianStart} from "./authoritarian-start.js"
import {
	MockProfiler,
	MockTokenStorage,
	mockAccountPopupLogin,
	mockDecodeAccessToken,
} from "./mocks.js"

demo()

async function demo() {
	const mocksMode: boolean = location.search.includes("mock") || location.hash.includes("mock")

	// console-log the events
	for (const event of ["user-login", "user-logout", "profile-loaded"])
	window.addEventListener(event, () => console.log(event))

	// use mocks in "?mock" mode
	if (mocksMode) {
		await authoritarianStart({
			profiler: new MockProfiler(),
			tokenStorage: new MockTokenStorage(),
			accountPopupLogin: mockAccountPopupLogin,
			decodeAccessToken: mockDecodeAccessToken,
		})
	}
	else {
		await authoritarianStart()
	}

	console.log("🤖")
}
