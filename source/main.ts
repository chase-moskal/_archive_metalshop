
import "menutown/dist/register-all.js"
import "./register-all.js"

import {select} from "./toolbox/selects.js"
import {authoritarianStart} from "./authoritarian-start.js"
import {
	MockProfiler,
	MockTokenStorage,
	mockAccountPopupLogin,
	mockDecodeAccessToken,
	mockFailingAccountPopupLogin,
} from "./mocks.js"

main()

async function main() {
	const config = select("authoritarian-config")
	const mock = config.hasAttribute("mock")
	const mockFail = config.getAttribute("mock").toLowerCase() === "fail"
	const debug = config.hasAttribute("debug")

	// console-log the events
	if (debug)
		for (const event of [
			"user-error",
			"user-login",
			"user-logout",
			"user-loading",
			"profile-update",
		]) window.addEventListener(event, () => console.log(event))

	// use mocks in "?mock" mode
	if (mock) await authoritarianStart({
		profiler: new MockProfiler(),
		tokenStorage: new MockTokenStorage(),
		accountPopupLogin: mockFail
			? mockFailingAccountPopupLogin
			: mockAccountPopupLogin,
		decodeAccessToken: mockDecodeAccessToken,
	})

	// standard start
	else await authoritarianStart()
}
