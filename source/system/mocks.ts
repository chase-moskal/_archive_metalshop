
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {makeAuthVanguard} from "authoritarian/dist/business/auth-api/vanguard.js"
import {makeAuthExchanger} from "authoritarian/dist/business/auth-api/exchanger.js"
import {mockStorage} from "authoritarian/dist/business/token-storage/mock-storage.js"
import {TokenStorage} from "authoritarian/dist/business/token-storage/token-storage.js"
import {makeScheduleSentry} from "authoritarian/dist/business/schedule-sentry/sentry.js"
import {makeQuestionsBureau} from "authoritarian/dist/business/questions-bureau/bureau.js"
import {mockUserDatalayer} from "authoritarian/dist/business/auth-api/mock-user-datalayer.js"
import {makeProfileMagistrate} from "authoritarian/dist/business/profile-magistrate/magistrate.js"
import {mockVerifyGoogleToken} from "authoritarian/dist/business/auth-api/mock-verify-google-token.js"
import {mockScheduleDatalayer} from "authoritarian/dist/business/schedule-sentry/mock-schedule-datalayer.js"
import {mockProfileDatalayer} from "authoritarian/dist/business/profile-magistrate/mock-profile-datalayer.js"
import {mockQuestionsDatalayer} from "authoritarian/dist/business/questions-bureau/mock-questions-datalayer.js"
import {AccessToken, AccessPayload, StripeLiaisonTopic, LiveshowGovernorTopic, RefreshPayload} from "authoritarian/dist/interfaces.js"

import {LoginPopupRoutine} from "../interfaces.js"

export const prepareAllMocks = async({
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
	const verifyGoogleToken = mockVerifyGoogleToken({
		googleResult: {
			googleId,
			name: `Faker McFakerson`,
			avatar: "https://picsum.photos/id/375/200/200",
		}
	})

	const {authVanguard, authDealer} = makeAuthVanguard({userDatalayer})
	const profileMagistrate = makeProfileMagistrate({
		profileDatalayer,
		verifyToken
	})

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

	const loginPopupRoutine: LoginPopupRoutine = async() => {
		return authExchanger.authenticateViaGoogle({
			googleToken: "fakeGoogleToken123"
		})
	}

	const tokenStorage = new TokenStorage({
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

	const stripeLiaison: StripeLiaisonTopic = {
		async createSessionForLinking({accessToken}) {
			return {
				stripeSessionId: "fake-stripe-session-123"
			}
		},
		async createSessionForPremium({accessToken}) {
			return {
				stripeSessionId: "fake-stripe-session-234"
			}
		},
		async setPremiumAutoRenew({accessToken, autoRenew}) {
			return null
		},
		async unlinkPaymentMethod({accessToken}) {
			return null
		},
	}

	const scheduleDatalayer = mockScheduleDatalayer()
	const scheduleSentry = makeScheduleSentry({verifyToken, scheduleDatalayer})

	// starting conditions
	const authTokens = await authExchanger.authenticateViaGoogle({
		googleToken: "fakeGoogleToken123"
	})
	const {userId} = await verifyToken<RefreshPayload>(authTokens.refreshToken)
	if (startLoggedIn) await tokenStorage.writeTokens(authTokens)
	await authVanguard.setClaims({
		userId,
		claims: {
			admin: !!startAdmin,
			premium: !!startPremium
				? {expires: Date.now() + (1000 * 60 * 60 * 24 * 30)}
				: null,
		}
	})

	return {
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
