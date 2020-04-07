
import {makeAuthClients} from "authoritarian/dist/business/auth-api/auth-clients.js"
import {triggerLoginPopup} from "authoritarian/dist/business/account-popup/trigger-login-popup.js"
import {makeQuestionsClients} from "authoritarian/dist/business/questions-bureau/questions-clients.js"
import {makeProfileMagistrateClient} from "authoritarian/dist/business/profile-magistrate/magistrate-client.js"
import {createTokenStorageClient} from "authoritarian/dist/business/token-storage/create-token-storage-client.js"

import {MetalConfig, MetalOptions} from "../../interfaces.js"
import {AuthoritarianStartupError} from "../../system/errors.js"
import {decodeAccessToken} from "../../system/decode-access-token.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function initialize(config: MetalConfig): Promise<MetalOptions> {
	let progress: Partial<MetalOptions> = {}
	progress.decodeAccessToken = decodeAccessToken

	//
	// use mocks instead of real microservices
	//

	if (config.mock !== null) {
		const {prepareAllMocks} =
			await import("../../system/mocks.js")
		const {
			authDealer,
			tokenStorage,
			scheduleSentry,
			paywallGuardian,
			questionsBureau,
			liveshowGovernor,
			loginPopupRoutine,
			profileMagistrate,
		} = await prepareAllMocks({
			startAdmin: config.mock?.includes("admin"),
			startPremium: config.mock?.includes("premium"),
			startLoggedIn: config.mock?.includes("loggedin"),
		})
		progress = {
			...progress,
			authDealer,
			tokenStorage,
			scheduleSentry,
			paywallGuardian,
			questionsBureau,
			liveshowGovernor,
			loginPopupRoutine,
			profileMagistrate,
		}
	}

	//
	// use real microservices, overwriting mocks
	//

	const operations = []
	const queue = (func: () => Promise<any>) => operations.push(func())
	const {
		["auth-server"]: authServerOrigin,
		["paywall-server"]: paywallServerOrigin,
		["profile-server"]: profileServerOrigin,
		["liveshow-server"]: liveshowServerOrigin,
		["schedule-server"]: scheduleServerOrigin,
		["questions-server"]: questionsServerOrigin,
	} = config

	if (authServerOrigin) {
		queue(async() => {
			const {authDealer} = await makeAuthClients({authServerOrigin})
			progress.authDealer = authDealer
			progress.loginPopupRoutine = async() => triggerLoginPopup({authServerOrigin})
			progress.tokenStorage = await createTokenStorageClient({authServerOrigin})
		})
	}

	if (profileServerOrigin) {
		queue(async() => {
			progress.profileMagistrate = await makeProfileMagistrateClient({profileServerOrigin})
		})
	}

	if (questionsServerOrigin) {
		queue(async() => {
			const {questionsBureau} = await makeQuestionsClients({questionsServerOrigin})
			progress.questionsBureau = questionsBureau
		})
	}

	if (scheduleServerOrigin) {
		queue(async() => {
			console.log("coming soon: schedule initialization")
			progress.scheduleSentry = null
		})
	}

	if (paywallServerOrigin) {
		queue(async() => {
			console.log("coming soon: paywall initialization")
			progress.paywallGuardian = null
		})
	}

	if (liveshowServerOrigin) {
		queue(async() => {
			console.log("coming soon: liveshow initialization")
			progress.liveshowGovernor = null
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
		authDealer: progress.authDealer,
		tokenStorage: progress.tokenStorage,
		scheduleSentry: progress.scheduleSentry,
		paywallGuardian: progress.paywallGuardian,
		questionsBureau: progress.questionsBureau,
		liveshowGovernor: progress.liveshowGovernor,
		profileMagistrate: progress.profileMagistrate,
		//—
		decodeAccessToken: progress.decodeAccessToken,
		loginPopupRoutine: progress.loginPopupRoutine,
	}
}
