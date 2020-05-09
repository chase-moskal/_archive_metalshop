
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {TokenStore} from "authoritarian/dist/business/auth/token-store.js"
import {makeAuthVanguard} from "authoritarian/dist/business/auth/vanguard.js"
import {makeAuthExchanger} from "authoritarian/dist/business/auth/exchanger.js"
import {mockStorage} from "authoritarian/dist/business/auth/mocks/mock-storage.js"
import {makePaywallLiaison} from "authoritarian/dist/business/paywall/liaison.js"
import {makeScheduleSentry} from "authoritarian/dist/business/schedule/sentry.js"
import {makeQuestionsBureau} from "authoritarian/dist/business/questions/bureau.js"
import {makeProfileMagistrate} from "authoritarian/dist/business/profile/magistrate.js"
import {makeSettingsSheriff} from "authoritarian/dist/business/settings/settings-sheriff.js"
import {mockUserDatalayer} from "authoritarian/dist/business/auth/mocks/mock-user-datalayer.js"
import {mockProfileDatalayer} from "authoritarian/dist/business/profile/mocks/mock-profile-datalayer.js"
import {mockVerifyGoogleToken} from "authoritarian/dist/business/auth/mocks/mock-verify-google-token.js"
import {mockScheduleDatalayer} from "authoritarian/dist/business/schedule/mocks/mock-schedule-datalayer.js"
import {mockSettingsDatalayer} from "authoritarian/dist/business/settings/mocks/mock-settings-datalayer.js"
import {mockQuestionsDatalayer} from "authoritarian/dist/business/questions/mocks/mock-questions-datalayer.js"

import {random8} from "authoritarian/dist/toolbox/random8.js"
import {mockStripeCircuit} from "authoritarian/dist/business/paywall/mocks/mock-stripe-circuit.js"
import {AccessToken, LiveshowGovernorTopic, AccessPayload} from "authoritarian/dist/interfaces.js"

import {nap} from "../../toolbox/nap.js"
import {TriggerAccountPopup, TriggerCheckoutPopup} from "../../interfaces.js"

export const makeAllMocks = async({
		startAdmin,
		startPremium,
		startLoggedIn,
	}: {
		startAdmin: boolean
		startPremium: boolean
		startLoggedIn: boolean
	}) => {

	const googleId = `mock-google-id-${random8()}`
	const googleToken = `mock-google-token-${random8()}`
	const premiumStripePlanId = `mock-premium-stripe-plan-${random8()}`

	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()
	const userDatalayer = mockUserDatalayer()
	const profileDatalayer = mockProfileDatalayer()
	const verifyGoogleToken = mockVerifyGoogleToken({
		googleResult: {
			googleId,
			name: `Faker McFakerson`,
			avatar: "https://i.imgur.com/CEqYyCy.jpg",
		}
	})

	const {authVanguard, authDealer} = makeAuthVanguard({userDatalayer})
	const profileMagistrate = makeProfileMagistrate({
		verifyToken,
		profileDatalayer,
	})

	const minute = 1000 * 60
	const day = minute * 60 * 24
	const accessTokenExpiresMilliseconds = 20 * minute
	const refreshTokenExpiresMilliseconds = day * 365
	const generateRandomNickname = () => `User-${random8().toUpperCase()}`

	const authExchanger = makeAuthExchanger({
		signToken,
		verifyToken,
		authVanguard,
		profileMagistrate,
		verifyGoogleToken,
		generateRandomNickname,
		accessTokenExpiresMilliseconds,
		refreshTokenExpiresMilliseconds,
	})

	const tokenStore = new TokenStore({
		authExchanger,
		storage: mockStorage(),
	})

	const questionsDatalayer = mockQuestionsDatalayer()
	const questionsBureau = makeQuestionsBureau({
		authDealer,
		verifyToken,
		profileMagistrate,
		questionsDatalayer,
	})

	let vimeoId = "109943349"
	const liveshowGovernor: LiveshowGovernorTopic = {
		async getShow(options: {
			accessToken: AccessToken
			videoName: string
		}): Promise<{vimeoId: string}> {
			return {vimeoId}
		},
		async setShow({vimeoId}: {
			accessToken: AccessToken
			vimeoId: string
			videoName: string
		}) {
			this._vimeoId = vimeoId
		}
	}

	const settingsDatalayer = mockSettingsDatalayer()
	const settingsSheriff = makeSettingsSheriff({verifyToken, settingsDatalayer})

	const {stripeDatalayer, billingDatalayer} = mockStripeCircuit({
		authVanguard,
		logger: console,
		settingsDatalayer,
	})
	const paywallLiaison = makePaywallLiaison({
		verifyToken,
		stripeDatalayer,
		billingDatalayer,
		premiumStripePlanId,
	})

	const scheduleDatalayer = mockScheduleDatalayer()
	const scheduleSentry = makeScheduleSentry({verifyToken, scheduleDatalayer})

	const checkoutPopupUrl = "http://metaldev.chasemoskal.com:8003/html/checkout"

	const triggerAccountPopup: TriggerAccountPopup =
		async() => authExchanger.authenticateViaGoogle({googleToken})

	const triggerCheckoutPopup: TriggerCheckoutPopup =
		async({stripeSessionId}) => null

	//
	// starting conditions
	//

	const days = 1000 * 60 * 60 * 24
	await scheduleDatalayer.setEvent("countdown1", {
		time: Date.now() + (3.14159 * days)
	})

	await tokenStore.clearTokens()

	if (startLoggedIn || startAdmin || startPremium) {
		const authTokens = await authExchanger.authenticateViaGoogle({googleToken})

		if (startAdmin) {
			const {user} = await verifyToken<AccessPayload>(authTokens.accessToken)
			const {userId, claims} = user
			claims.admin = true
			await authVanguard.setClaims({userId, claims})
		}

		if (startPremium) {
			await paywallLiaison.checkoutPremium({
				popupUrl: checkoutPopupUrl,
				accessToken: authTokens.accessToken,
			})
		}

		if (startLoggedIn) {
			const {refreshToken} = authTokens
			authTokens.accessToken = await authExchanger.authorize({refreshToken})
			await tokenStore.writeTokens(authTokens)
		}
	}

	// TODO latency
	// adding mock latency
	{
		const lag = <T extends (...args: any[]) => Promise<any>>(func: T) => {
			return async function(...args: any[]) {
				const ms = (Math.random() * 600) + 100
				console.log(`mock lag added: ${func.name} by ${ms.toFixed(0)} milliseconds`)
				await nap(ms)
				return func.apply(this, args)
			}
		}

		authVanguard.getUser = lag(authVanguard.getUser)
		authVanguard.setClaims = lag(authVanguard.setClaims)
		authVanguard.createUser = lag(authVanguard.createUser)
		profileMagistrate.getProfile = lag(profileMagistrate.getProfile)
		profileMagistrate.setProfile = lag(profileMagistrate.setProfile)
		authExchanger.authenticateViaGoogle = lag(authExchanger.authenticateViaGoogle)
		authExchanger.authorize = lag(authExchanger.authorize)
		questionsBureau.fetchQuestions = lag(questionsBureau.fetchQuestions)
		settingsSheriff.fetchSettings = lag(settingsSheriff.fetchSettings)
		settingsSheriff.setAdminMode = lag(settingsSheriff.setAdminMode)
		paywallLiaison.checkoutPremium = lag(paywallLiaison.checkoutPremium)
		paywallLiaison.cancelPremium = lag(paywallLiaison.cancelPremium)
		paywallLiaison.updatePremium = lag(paywallLiaison.updatePremium)
	}

	return {
		authDealer,
		tokenStore,
		paywallLiaison,
		scheduleSentry,
		settingsSheriff,
		questionsBureau,
		liveshowGovernor,
		checkoutPopupUrl,
		profileMagistrate,
		triggerAccountPopup,
		triggerCheckoutPopup,
	}
}
