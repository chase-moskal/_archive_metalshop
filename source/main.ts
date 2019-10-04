
import "menutown/dist/register-all.js"
import "./register-all.js"

import {select} from "./toolbox/selects.js"
import {authoritarianStart} from "./authoritarian-start.js"

main()

async function main() {
	const config = select("authoritarian-config")
	const mock = config.hasAttribute("mock")
	const debug = config.hasAttribute("debug")

	// console-log the events
	if (debug)
		for (const event of [
			"user-error",
			"user-login",
			"user-logout",
			"user-loading",
			"profile-error",
			"profile-update",
		]) window.addEventListener(event, () => console.log(event))

	// use mocks in "?mock" mode
	if (mock) {
		const {
			MockProfiler,
			MockTokenStorage,
			MockPaywallGuardian,
			mockAccountPopupLogin,
			mockDecodeAccessToken,
		} = await import("./mocks.js")
		await authoritarianStart({
			profiler: new MockProfiler(),
			tokenStorage: new MockTokenStorage(),
			accountPopupLogin: mockAccountPopupLogin,
			paywallGuardian: new MockPaywallGuardian(),
			// decodeAccessToken: mockDecodeAccessToken,
		})
	}

	// standard start
	else await authoritarianStart()
}
