
import {
	tokenStorageClient,
	profileMagistrateCacheClient,
} from "authoritarian/dist/clients.js"

import {
	AuthoritarianConfig,
	AuthoritarianOptions,
} from "../interfaces.js"

import {
	MockQuestionsBureau,
	MockTokenStorageAdmin,
	MockTokenStorageLoggedOut,
} from "../system/mocks.js"

import {AuthoritarianStartupError} from "../system/errors.js"
const err = (message: string) => new AuthoritarianStartupError(message)

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
	// use mocks instead of real microservices
	//

	if (config.mock) {
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
			questionsBureau: new MockQuestionsBureau(),
			privateVimeoGovernor: new MockPrivateVimeoGovernor(),
		}
	}

	//
	// use real microservices
	//

	const operations = []
	const queue = (func: () => Promise<any>) => operations.push(func())

	queue(async() => {
		if (config.authServer) {
			progress.loginPopupRoutine = prepareLoginPopupRoutine(
				config.authServer,
				accountPopupLogin
			)
			progress.tokenStorage = await tokenStorageClient({
				url: `${config.authServer}/html/token-storage`
			})
		}
	})

	queue(async() => {
		if (config.profileServer) {
			progress.profileMagistrate = await profileMagistrateCacheClient({
				url: config.profileServer
			})
		}
	})

	queue(async() => {
		if (config.paywallServer) {
			console.log("coming soon: paywall guardian initialization")
			progress.paywallGuardian = null
		}
	})

	queue(async() => {
		if (config.privateVimeoServer) {
			console.log("coming soon: paywall guardian initialization")
			progress.privateVimeoGovernor = null
		}
	})

	try {
		await Promise.all(operations)
	}
	catch (error) {
		console.error(err(error.message))
	}

	//
	// return options
	//

	return {
		debug: progress.debug,

		tokenStorage: progress.tokenStorage,
		paywallGuardian: progress.paywallGuardian,
		questionsBureau: progress.questionsBureau,
		profileMagistrate: progress.profileMagistrate,
		privateVimeoGovernor: progress.privateVimeoGovernor,

		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,
	}
}
