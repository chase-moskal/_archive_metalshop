
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

/**
 * Prepare all of the options for the start routine
 * - use the simpler config to decide how to start
 * - create microservice instances
 * - otherwise provide mock instances
 */
export async function initializeOptions(config: AuthoritarianConfig): Promise<AuthoritarianOptions> {
	let progress: Partial<AuthoritarianOptions> = {}
	if (config.debug) progress.debug = true
	progress.eventTarget = document.body
	progress.decodeAccessToken = decodeAccessToken
	progress.userPanels = selects("user-panel")
	progress.userButtons = selects("user-button")
	progress.paywallPanels = selects("paywall-panel")
	progress.profilePanels = selects("profile-panel")

	//
	// use mocks instead of real microservices
	//

	if (config.mock) {
		const {
			MockProfiler,
			MockTokenStorage,
			MockPaywallGuardian,
			mockLoginPopupRoutine,
		} = await import("../system/mocks.js")
		progress = {
			...progress,
			profiler: new MockProfiler(),
			tokenStorage: new MockTokenStorage(),
			loginPopupRoutine: mockLoginPopupRoutine,
			paywallGuardian: new MockPaywallGuardian(),
		}
	}

	//
	// use real microservices
	//

	else {

		if (config.profilerService) {
			progress.profiler = await createProfilerCacheCrosscallClient({
				url: config.profilerService
			})
		}

		if (config.authServer) {
			progress.loginPopupRoutine = prepareLoginPopupRoutine(
				config.authServer,
				accountPopupLogin
			)
			progress.tokenStorage = await createTokenStorageCrosscallClient({
				url: `${config.authServer}/html/token-storage`
			})
		}
	
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
