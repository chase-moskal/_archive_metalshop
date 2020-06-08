
import {makeLogger} from "authoritarian/dist/toolbox/logger/make-logger.js"

import {makeAuthClients} from "authoritarian/dist/business/auth/auth-clients.js"
import {makeProfileClients} from "authoritarian/dist/business/profile/profile-clients.js"
import {makePaywallClients} from "authoritarian/dist/business/paywall/paywall-clients.js"
import {makeQuestionsClients} from "authoritarian/dist/business/questions/questions-clients.js"
import {openVaultIframe} from "authoritarian/dist/business/auth/vault-popup/open-vault-iframe.js"
import {openAccountPopup} from "authoritarian/dist/business/auth/account-popup/open-account-popup.js"
import {openCheckoutPopup} from "authoritarian/dist/business/paywall/checkout-popup/open-checkout-popup.js"

import {MetalConfig, MetalOptions} from "../interfaces.js"
import {AuthoritarianStartupError} from "../system/errors.js"
import {decodeAccessToken} from "../system/decode-access-token.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function initialize(config: MetalConfig): Promise<MetalOptions> {
	let options: Partial<MetalOptions> = {}
	options.logger = makeLogger()
	options.decodeAccessToken = decodeAccessToken

	//
	// use mocks instead of real microservices
	//

	if (config.mock !== null) {
		const {makeMocks: makeMetalMocks} = await import("./make-mocks.js")
		options = await makeMetalMocks({
			logger: options.logger,
			startAdmin: config.mock?.includes("admin"),
			startPremium: config.mock?.includes("premium"),
			startLoggedIn: config.mock?.includes("loggedin"),
		})
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
			options.triggerAccountPopup = async() => {
				const {promisedPayload} = openAccountPopup({
					authServerOrigin
				})
				return promisedPayload
			}
			const {tokenStore} = await openVaultIframe({authServerOrigin})
			options.tokenStore = tokenStore
		})
	}

	if (profileServerOrigin) {
		queue(async() => {
			const {profileMagistrate} = await makeProfileClients({profileServerOrigin})
			options.profileMagistrate = profileMagistrate
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
			console.log("coming soon: paywall initialization!")
			options.triggerCheckoutPopup = async({stripeSessionId}: {
					stripeSessionId: string
				}) => {
				openCheckoutPopup({
					stripeSessionId,
					paywallServerOrigin,
				})
			}
			const {paywallLiaison} = await makePaywallClients({paywallServerOrigin})
			options.checkoutPopupUrl = `${paywallServerOrigin}/html/checkout`
			options.paywallLiaison = paywallLiaison
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
		logger: options.logger,
		authDealer: options.authDealer,
		tokenStore: options.tokenStore,
		adminSearch: options.adminSearch,
		paywallLiaison: options.paywallLiaison,
		scheduleSentry: options.scheduleSentry,
		settingsSheriff: options.settingsSheriff,
		questionsBureau: options.questionsBureau,
		liveshowGovernor: options.liveshowGovernor,
		profileMagistrate: options.profileMagistrate,
		//—
		checkoutPopupUrl: options.checkoutPopupUrl,
		decodeAccessToken: options.decodeAccessToken,
		triggerAccountPopup: options.triggerAccountPopup,
		triggerCheckoutPopup: options.triggerCheckoutPopup,
	}
}
