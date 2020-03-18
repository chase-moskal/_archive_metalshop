
import {createTokenStorageClient}
	from "authoritarian/dist/clients/create-token-storage-client.js"

import {createProfileMagistrateClient}
	from "authoritarian/dist/clients/create-profile-magistrate-client.js"

import {triggerLoginPopup}
	from "authoritarian/dist/account-popup/trigger-login-popup.js"

import {AuthoritarianStartupError} from "../../system/errors.js"
import {decodeAccessToken} from "../../system/decode-access-token.js"

import {
	AuthoritarianConfig,
	AuthoritarianOptions,
} from "../../interfaces.js"

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
		const {prepareAllMocks, getMockTokens} =
			await import("../../system/mocks.js")
		const {
			tokenStorage,
			vimeoGovernor,
			scheduleSentry,
			paywallGuardian,
			questionsBureau,
			loginPopupRoutine,
			profileMagistrate,
		} = prepareAllMocks({
			mockTokens: await getMockTokens(),
			startAdmin: config.mock === "admin",
			startPremium: config.mock === "premium",
			startLoggedIn: config.mock === "loggedin"
				|| config.mock === "admin"
				|| config.mock === "premium",
		})
		progress = {
			...progress,
			tokenStorage,
			vimeoGovernor,
			scheduleSentry,
			paywallGuardian,
			questionsBureau,
			loginPopupRoutine,
			profileMagistrate,
		}
	}

	//
	// use real microservices
	//

	const operations = []
	const queue = (func: () => Promise<any>) => operations.push(func())

	if (config.authServer) {
		queue(async() => {
			progress.loginPopupRoutine = async() => triggerLoginPopup({
				authServerOrigin: config.authServer
			})
			progress.tokenStorage = await createTokenStorageClient({
				authServerOrigin: config.authServer
			})
		})
	}

	if (config.profileServer) {
		queue(async() => {
			progress.profileMagistrate = await createProfileMagistrateClient({
				profileServerOrigin: config.profileServer
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
