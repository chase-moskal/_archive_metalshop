
import "menutown/dist/register-all.js"
import "./register-all.js"

import {authoritarianStart} from "./authoritarian-start.js"
import {
	MockProfiler,
	MockTokenStorage,
	mockAccountPopupLogin,
	mockDecodeAccessToken,
} from "./mocks.js"

main()

function modeCheck(m: string): boolean {
	return location.hash.toLowerCase().includes(m) ||
		location.search.toLowerCase().includes(m)
}

async function main() {

	// ascertain "authmock" mode
	const authmock: boolean = modeCheck("authmock")

	// ascertain "authdebug" mode
	const authdebug: boolean = modeCheck("authdebug")

	// console-log the events
	if (authdebug)
		for (const event of ["user-login", "user-logout", "profile-loaded"])
			window.addEventListener(event, () => console.log(event))

	// use mocks in "?mock" mode
	if (authmock) {
		await authoritarianStart({
			profiler: new MockProfiler(),
			tokenStorage: new MockTokenStorage(),
			accountPopupLogin: mockAccountPopupLogin,
			decodeAccessToken: mockDecodeAccessToken,
		})
	}

	// standard start
	else {
		await authoritarianStart()
	}
}
