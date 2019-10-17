
import {
	createTokenStorageCrosscallClient,
	createProfilerCacheCrosscallClient,
} from "authoritarian/dist/clients.js"

import {
	AuthoritarianConfig,
	AuthoritarianOptions,
} from "../system/interfaces.js"

import {
	MockTokenStorageAdmin,
	MockTokenStorageLoggedOut,
} from "../system/mocks.js"

import {
	accountPopupLogin,
	prepareLoginPopupRoutine,
} from "../toolbox/account-popup-login.js"
import {selects} from "../toolbox/selects.js"
import {decodeAccessToken} from "../toolbox/decode-access-token.js"

/**
 * Prepare all of the options for the start routine
 * - use the simpler config to decide how to start
 * - create microservice instances
 * - otherwise provide mock instances
 */
export async function initialize(config: AuthoritarianConfig):
 Promise<AuthoritarianOptions> {

	let progress: Partial<AuthoritarianOptions> = {}

	//
	// pass over simple config as options
	//

	progress.debug = !!config.debug
	progress.decodeAccessToken = decodeAccessToken

	//
	// select dom elements
	//

	progress.userPanels = selects("user-panel")
	progress.paywallPanels = selects("paywall-panel")
	progress.profilePanels = selects("profile-panel")
	progress.avatarDisplays = selects("avatar-display")
	progress.privateLivestreams = selects("private-livestream")

	//
	// use mocks instead of real microservices
	//

	if (config.mock !== undefined) {
		const {
			MockProfiler,
			MockTokenStorage,
			MockPaywallGuardian,
			mockLoginPopupRoutine,
			MockRestrictedLivestream,
		} = await import("../system/mocks.js")
		progress = {
			...progress,
			profiler: new MockProfiler(),
			tokenStorage: config.mock === "admin"
				? new MockTokenStorageAdmin()
				: config.mock === "loggedout"
					? new MockTokenStorageLoggedOut()
					: new MockTokenStorage(),
			loginPopupRoutine: mockLoginPopupRoutine,
			paywallGuardian: new MockPaywallGuardian(),
			restrictedLivestream: new MockRestrictedLivestream()
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
			console.log("coming soon: paywall guardian initialization")
			progress.paywallGuardian = null
		}

		if (config.livestreamServer) {
			console.log("coming soon: paywall guardian initialization")
			progress.restrictedLivestream = null
		}
	}

	//
	// return options
	//

	return {
		debug: progress.debug,

		profiler: progress.profiler,
		tokenStorage: progress.tokenStorage,
		paywallGuardian: progress.paywallGuardian,
		restrictedLivestream: progress.restrictedLivestream,

		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,

		userPanels: progress.userPanels,
		paywallPanels: progress.paywallPanels,
		profilePanels: progress.profilePanels,
		avatarDisplays: progress.avatarDisplays,
		privateLivestreams: progress.privateLivestreams,
	}
}
