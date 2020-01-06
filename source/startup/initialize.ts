
import {createTokenStorageClient}
	from "authoritarian/dist/clients/create-token-storage-client.js"

import {createProfileMagistrateClient}
	from "authoritarian/dist/clients/create-profile-magistrate-client.js"

import {accountPopupLogin}
	from "authoritarian/dist/account-popup/account-popup-login.js"

import {
	MockScheduleSentry,
	MockQuestionsBureau,
	MockTokenStorageAdmin,
	MockTokenStorageLoggedOut,
} from "../system/mocks.js"
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

	if (config.mock !== null) {
		const {
			MockTokenStorage,
			MockVimeoGovernor,
			MockPaywallGuardian,
			mockLoginPopupRoutine,
			MockProfileMagistrate,
		} = await import("../system/mocks.js")
		progress = {
			...progress,
			profileMagistrate: new MockProfileMagistrate(),
			tokenStorage: config.mock === "admin"
				? new MockTokenStorageAdmin()
				: config.mock === "loggedin"
					? new MockTokenStorage()
					: new MockTokenStorageLoggedOut(),
			vimeoGovernor: new MockVimeoGovernor(),
			loginPopupRoutine: mockLoginPopupRoutine,
			scheduleSentry: new MockScheduleSentry(),
			paywallGuardian: new MockPaywallGuardian(),
			questionsBureau: new MockQuestionsBureau(),
		}
	}

	//
	// use real microservices
	//

	const operations = []
	const queue = (func: () => Promise<any>) => operations.push(func())

	if (config.authServer) {
		queue(async() => {
			progress.loginPopupRoutine = async() => accountPopupLogin(
				config.authServer
			)
			progress.tokenStorage = await createTokenStorageClient({
				url: `${config.authServer}/html/token-storage`
			})
		})
	}

	if (config.profileServer) {
		queue(async() => {
			progress.profileMagistrate = createProfileMagistrateClient({
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

	if (config.vimeoServer) {
		queue(async() => {
			console.log("coming soon: paywall guardian initialization")
			progress.vimeoGovernor = null
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
		vimeoGovernor: progress.vimeoGovernor,
		scheduleSentry: progress.scheduleSentry,
		paywallGuardian: progress.paywallGuardian,
		questionsBureau: progress.questionsBureau,
		profileMagistrate: progress.profileMagistrate,

		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,
	}
}
