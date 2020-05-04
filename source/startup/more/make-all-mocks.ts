
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
import {AccessToken, LiveshowGovernorTopic, RefreshPayload} from "authoritarian/dist/interfaces.js"

import {TriggerAccountPopup, TriggerCheckoutPopup} from "../../interfaces.js"

import {nap} from "../../toolbox/nap.js"

export const makeAllMocks = async({
		startAdmin,
		startPremium,
		startLoggedIn,
	}: {
		startAdmin: boolean
		startPremium: boolean
		startLoggedIn: boolean
	}) => {
	const googleId = "g123456"
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()
	const userDatalayer = mockUserDatalayer()
	const profileDatalayer = mockProfileDatalayer()
	const premiumStripePlanId = `mock-premium-stripe-plan-${random8()}`
	const verifyGoogleToken = mockVerifyGoogleToken({
		googleResult: {
			googleId,
			name: `Faker McFakerson`,
			avatar: "https://picsum.photos/id/375/200/200",
		}
	})

	const {authVanguard, authDealer} = makeAuthVanguard({userDatalayer})
	const profileMagistrate = makeProfileMagistrate({
		verifyToken,
		profileDatalayer,
	})

	// TODO latency
	// adding mock latency
	{
		const {getProfile} = profileMagistrate
		profileMagistrate.getProfile = async(options) => {
			console.log("get profile!")
			await nap(10)
			return getProfile.call(profileMagistrate, options)
		}
	}

	let count = 0
	const generateRandomNickname = () => `user-${++count}`

	const year = 1000 * 60 * 60 * 24 * 365
	const accessTokenExpiresMilliseconds = 1000 * year
	const refreshTokenExpiresMilliseconds = 1001 * year

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

	const triggerAccountPopup: TriggerAccountPopup = async() => {
		return authExchanger.authenticateViaGoogle({
			googleToken: "fakeGoogleToken123"
		})
	}

	const triggerCheckoutPopup: TriggerCheckoutPopup =
		async({stripeSessionId}) => { /* noop */ }

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
		logger: console,
		authVanguard,
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

	//
	// starting conditions
	//

	const authTokens = await authExchanger.authenticateViaGoogle({
		googleToken: "fakeGoogleToken123"
	})
	const {userId} = await verifyToken<RefreshPayload>(authTokens.refreshToken)
	if (startLoggedIn) await tokenStore.writeTokens(authTokens)
	await authVanguard.setClaims({
		userId,
		claims: {
			admin: !!startAdmin,
			premium: !!startPremium,
		}
	})

	return {
		authDealer,
		tokenStore,
		paywallLiaison,
		scheduleSentry,
		settingsSheriff,
		questionsBureau,
		liveshowGovernor,
		profileMagistrate,
		triggerAccountPopup,
		triggerCheckoutPopup,
	}
}
