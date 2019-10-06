
import {
	createTokenStorageCrosscallClient,
	createProfilerCacheCrosscallClient,
} from "authoritarian/dist/clients.js"

import {
	accountPopupLogin,
	prepareLoginPopupRoutine,
} from "../toolbox/account-popup-login.js"
import {decodeAccessToken} from "../toolbox/decode-access-token.js"

import {selects} from "../toolbox/selects.js"
import {AuthoritarianOptions, AuthoritarianConfig} from "../system/interfaces.js"

export async function initializeOptions(config: AuthoritarianConfig): Promise<AuthoritarianOptions> {
	let progress: Partial<AuthoritarianOptions> = {}

	progress.userPanels = selects("user-panel")
	progress.userButtons = selects("user-button")
	progress.paywallPanels = selects("paywall-panel")
	progress.profilePanels = selects("profile-panel")

	progress.eventTarget = document.body
	progress.decodeAccessToken = decodeAccessToken

	if (config.debug) progress.debug = true

	if (config.mock) {
		const {
			MockProfiler,
			MockTokenStorage,
			MockPaywallGuardian,
			mockLoginPopupRoutine,
			// mockDecodeAccessToken,
		} = await import("../system/mocks.js")
		progress = {
			...progress,
			profiler: new MockProfiler(),
			tokenStorage: new MockTokenStorage(),
			loginPopupRoutine: mockLoginPopupRoutine,
			paywallGuardian: new MockPaywallGuardian()
			// using the real decodeAccessToken, we have legit mock tokens for it
		}
	}
	else {

		// profiler
		if (config.profilerService) {
			progress.profiler = await createProfilerCacheCrosscallClient({
				url: config.profilerService
			})
		}

		// auth server - token storage and login popup routine
		if (config.authServer) {
			progress.loginPopupRoutine = prepareLoginPopupRoutine(
				config.authServer,
				accountPopupLogin
			)
			progress.tokenStorage = await createTokenStorageCrosscallClient({
				url: `${config.authServer}/html/token-storage`
			})
		}

		// paywall guardian
		if (config.paywallGuardian) {
			progress.paywallGuardian = null
		}
	}

	return {
		debug: progress.debug,

		profiler: progress.profiler,
		tokenStorage: progress.tokenStorage,
		paywallGuardian: progress.paywallGuardian,

		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,

		userPanels: progress.userPanels,
		eventTarget: progress.eventTarget,
		userButtons: progress.userButtons,
		paywallPanels: progress.paywallPanels,
		profilePanels: progress.profilePanels,
	}
}
