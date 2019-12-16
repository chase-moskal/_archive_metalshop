
import {
	tokenStorageClient,
	profileMagistrateCacheClient,
} from "authoritarian/dist/clients.js"

import {
	MockQuestionsBureau,
	MockTokenStorageAdmin,
	MockTokenStorageLoggedOut,
} from "../system/mocks.js"
import {
	accountPopupLogin,
	prepareLoginPopupRoutine,
} from "../system/account-popup-login.js"
import {AuthoritarianStartupError} from "../system/errors.js"
import {decodeAccessToken} from "../system/decode-access-token.js"

import {
	AuthoritarianConfig,
	AuthoritarianOptions,
} from "../interfaces.js"

const err = (message: string) => new AuthoritarianStartupError(message)

/**
 * Prepare all of the options for the start routine
 * - use the simpler config to decide how to start
 * - create microservice instances
 * - otherwise provide mock instances
 */
export async function initialize(config: AuthoritarianConfig):
 Promise<AuthoritarianOptions> {

	let progress: Partial<AuthoritarianOptions> = {}
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

	if (config.authServer) {
		queue(async() => {
			progress.loginPopupRoutine = prepareLoginPopupRoutine(
				config.authServer,
				accountPopupLogin
			)
			progress.tokenStorage = await tokenStorageClient({
				url: `${config.authServer}/html/token-storage`
			})
		})
	}

	if (config.profileServer) {
		queue(async() => {
			progress.profileMagistrate = await profileMagistrateCacheClient({
				url: config.profileServer
			})
		})
	}

	if (config.paywallServer) {
		queue(async() => {
			console.log("coming soon: paywall guardian initialization")
			progress.paywallGuardian = null
		})
	}

	if (config.privateVimeoServer) {
		queue(async() => {
			console.log("coming soon: paywall guardian initialization")
			progress.privateVimeoGovernor = null
		})
	}

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
		tokenStorage: progress.tokenStorage,
		paywallGuardian: progress.paywallGuardian,
		questionsBureau: progress.questionsBureau,
		profileMagistrate: progress.profileMagistrate,
		privateVimeoGovernor: progress.privateVimeoGovernor,

		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,
	}
}
