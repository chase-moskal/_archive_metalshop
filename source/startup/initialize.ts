
import {
	createTokenStorageCrosscallClient,
	createProfileMagistrateCacheCrosscallClient,
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
	progress.privateVimeos = selects("private-vimeo")
	progress.avatarDisplays = selects("avatar-display")

	//
	// use mocks instead of real microservices
	//

	if (config.mock !== undefined) {
		const {
			MockTokenStorage,
			MockPaywallGuardian,
			mockLoginPopupRoutine,
			MockProfileMagistrate,
			MockPrivateVimeoGovernor,
		} = await import("../system/mocks.js")
		progress = {
			...progress,
			profileMagistrate: new MockProfileMagistrate(),
			tokenStorage: config.mock === "admin"
				? new MockTokenStorageAdmin()
				: config.mock === "loggedout"
					? new MockTokenStorageLoggedOut()
					: new MockTokenStorage(),
			loginPopupRoutine: mockLoginPopupRoutine,
			paywallGuardian: new MockPaywallGuardian(),
			privateVimeoGovernor: new MockPrivateVimeoGovernor()
		}
	}

	//
	// use real microservices
	//

	else {

		if (config.profilerService) {
			progress.profileMagistrate =
				await createProfileMagistrateCacheCrosscallClient({
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

		if (config.privateVimeoServer) {
			console.log("coming soon: paywall guardian initialization")
			progress.privateVimeoGovernor = null
		}
	}

	//
	// return options
	//

	return {
		debug: progress.debug,

		profileMagistrate: progress.profileMagistrate,
		tokenStorage: progress.tokenStorage,
		paywallGuardian: progress.paywallGuardian,
		privateVimeoGovernor: progress.privateVimeoGovernor,

		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,

		userPanels: progress.userPanels,
		paywallPanels: progress.paywallPanels,
		profilePanels: progress.profilePanels,
		privateVimeos: progress.privateVimeos,
		avatarDisplays: progress.avatarDisplays,
	}
}
