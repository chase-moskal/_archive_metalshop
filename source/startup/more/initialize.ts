
import {makeAuthClients} from "authoritarian/dist/business/auth-api/auth-clients.js"
import {openAccountPopup} from "authoritarian/dist/business/account-popup/open-account-popup.js"
import {openPaywallPopup} from "authoritarian/dist/business/paywall-popup/open-paywall-popup.js"
import {makeQuestionsClients} from "authoritarian/dist/business/questions-bureau/questions-clients.js"
import {makeProfileMagistrateClient} from "authoritarian/dist/business/profile-magistrate/magistrate-client.js"
import {createTokenStorageClient} from "authoritarian/dist/business/token-storage/create-token-storage-client.js"

import {MetalConfig, MetalOptions} from "../../interfaces.js"
import {AuthoritarianStartupError} from "../../system/errors.js"
import {decodeAccessToken} from "../../system/decode-access-token.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function initialize(config: MetalConfig): Promise<MetalOptions> {
	let options: Partial<MetalOptions> = {}
	options.decodeAccessToken = decodeAccessToken

	//
	// use mocks instead of real microservices
	//

	if (config.mock !== null) {
		const {prepareAllMocks} =
			await import("../../system/mocks.js")
		const {
			authDealer,
			tokenStorage,
			stripeLiaison,
			scheduleSentry,
			questionsBureau,
			liveshowGovernor,
			loginPopupRoutine,
			profileMagistrate,
		} = await prepareAllMocks({
			startAdmin: config.mock?.includes("admin"),
			startPremium: config.mock?.includes("premium"),
			startLoggedIn: config.mock?.includes("loggedin"),
		})
		options = {
			...options,
			authDealer,
			tokenStorage,
			stripeLiaison,
			scheduleSentry,
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
			options.authDealer = authDealer
			options.loginPopupRoutine = async() => {
				const {promisedPayload} = openAccountPopup({
					authServerOrigin
				})
				return promisedPayload
			}
			options.tokenStorage = await createTokenStorageClient({authServerOrigin})
		})
	}

	if (profileServerOrigin) {
		queue(async() => {
			options.profileMagistrate = await makeProfileMagistrateClient({profileServerOrigin})
		})
	}

	if (questionsServerOrigin) {
		queue(async() => {
			const {questionsBureau} = await makeQuestionsClients({questionsServerOrigin})
			options.questionsBureau = questionsBureau
		})
	}

	if (scheduleServerOrigin) {
		queue(async() => {
			console.log("coming soon: schedule initialization")
			options.scheduleSentry = null
		})
	}

	if (paywallServerOrigin) {
		queue(async() => {
			console.log("coming soon: paywall initialization")
			options.triggerPaywallPopup = async({stripeSessionId}: {
					stripeSessionId: string
				}) => {
				openPaywallPopup({
					stripeSessionId,
					paywallServerOrigin,
				})
			}
			options.stripeLiaison = null
		})
	}

	if (liveshowServerOrigin) {
		queue(async() => {
			console.log("coming soon: liveshow initialization")
			options.liveshowGovernor = null
		})
	}

	try {
		await Promise.all(operations)
	}
	catch (error) {
		console.error(err(error.message))
	}

	return {
		authDealer: options.authDealer,
		tokenStorage: options.tokenStorage,
		stripeLiaison: options.stripeLiaison,
		scheduleSentry: options.scheduleSentry,
		questionsBureau: options.questionsBureau,
		liveshowGovernor: options.liveshowGovernor,
		profileMagistrate: options.profileMagistrate,
		//—
		decodeAccessToken: options.decodeAccessToken,
		loginPopupRoutine: options.loginPopupRoutine,
		triggerPaywallPopup: options.triggerPaywallPopup,
	}
}
