
import {
	Profile,
	AuthTokens,
	AccessToken,
	RefreshToken,
	TokenStorageTopic,
	PaywallGuardianTopic,
	LiveshowGovernorTopic,
	ProfileMagistrateTopic,
} from "authoritarian/dist/interfaces.js"

import {makeAuthVanguard} from "authoritarian/dist/business/auth-api/vanguard.js"
import {mockUserDatalayer} from "authoritarian/dist/business/auth-api/mock-user-datalayer.js"

import {nap} from "../toolbox/nap.js"

import {
	LoginPopupRoutine,
	ScheduleSentryTopic,
} from "../interfaces.js"

const dist = "./dist"
const debugLogs = true

const debug = (message: string) => debugLogs
	? console.debug(`mock: ${message}`)
	: null

const getToken = async(name: string) => (await fetch(`${dist}/${name}`)).text()

export interface MockTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
	adminAccessToken: AccessToken
	premiumAccessToken: AccessToken
}

export const getMockTokens = async(): Promise<MockTokens> => ({
	accessToken: await getToken("mock-access.token"),
	refreshToken: await getToken("mock-refresh.token"),
	adminAccessToken: await getToken("mock-access-admin.token"),
	premiumAccessToken: await getToken("mock-access-premium.token"),
})

export const prepareAllMocks = ({
	mockTokens,
	startAdmin,
	startPremium,
	startLoggedIn,
}: {
	mockTokens: MockTokens
	startAdmin: boolean
	startPremium: boolean
	startLoggedIn: boolean
}) => {
	const state = {
		admin: startAdmin,
		premium: startPremium,
		loggedIn: startLoggedIn,
		profile: <Profile>{
			userId: "fake-h31829h381273h",
			nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
			avatar: "https://picsum.photos/id/375/200/200",
		},
		tokens: <AuthTokens>{
			get accessToken() {
				return state.loggedIn
					? state.admin
						? mockTokens.adminAccessToken
						: state.premium
							? mockTokens.premiumAccessToken
							: mockTokens.accessToken
					: null
			},
			get refreshToken() {
				return state.loggedIn
					? mockTokens.refreshToken
					: null
			},
		}
	}

	const userDatalayer = mockUserDatalayer()
	userDatalayer.insertRecord({
		claims: {},
		googleId: "g12345",
	})
	const {authDealer} = makeAuthVanguard({userDatalayer})

	const loginPopupRoutine: LoginPopupRoutine = async() => {
		debug("loginPopupRoutine")
		await nap()
		state.loggedIn = true
		const {accessToken, refreshToken} = state.tokens
		return {accessToken, refreshToken}
	}

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

	const tokenStorage: TokenStorageTopic = {
		async passiveCheck() {
			debug("passiveCheck")
			await nap()
			return state.tokens.accessToken
		},
		async writeTokens(tokens: AuthTokens) {
			debug("writeTokens")
			await nap()
		},
		async writeAccessToken(accessToken: AccessToken) {
			debug("writeAccessToken")
			await nap()
		},
		async clearTokens() {
			debug("clearTokens")
			await nap()
		},
	}

	const profileMagistrate: ProfileMagistrateTopic = {
		async getProfile({userId}): Promise<Profile> {
			debug("getProfile")
			await nap()
			return {
				...state.profile,
				userId,
			}
		},
		async setProfile({profile}): Promise<void> {
			debug("setFullProfile")
			await nap()
			state.profile = profile
		},
	}

	const paywallGuardian: PaywallGuardianTopic = {
		async grantUserPremium(options: {accessToken: AccessToken}) {
			debug("grantUserPremium")
			await nap()
			state.premium = true
			return state.tokens.accessToken
		},
		async revokeUserPremium(options: {accessToken: AccessToken}) {
			debug("revokeUserPremium")
			await nap()
			state.admin = false
			state.premium = false
			return state.tokens.accessToken
		},
	}

	const scheduleSentry = new class MockScheduleSentry
		implements ScheduleSentryTopic {

		_data: {[key: string]: number} = {}

		constructor({data = {
			countdown1: Date.now() + 1000 * 60 * 60 * 80
		}}: {data?: {[key: string]: number}} = {}) {
			this._data = data
		}

		async getEventTime(key: string): Promise<number> {
			if (this._data.hasOwnProperty(key)) {
				return this._data[key]
			}
			else {
				return null
			}
		}

		async setEventTime(key: string, time: number) {
			this._data[key] = time
		}
	}

	return {
		authDealer,
		tokenStorage,
		scheduleSentry,
		questionsBureau: null,
		paywallGuardian,
		liveshowGovernor,
		loginPopupRoutine,
		profileMagistrate,
	}
}

// export const mockQuestions: Question[] = [
// 	{
// 		questionId: "q123",
// 		author: {
// 			userId: "u345",
// 			nickname: "Johnny Texas",
// 			avatar: "",
// 			admin: false,
// 			premium: false,
// 		},
// 		content: "how is lord brim so cool?",
// 		likeInfo: {
// 			likes: 2,
// 			liked: false,
// 		},
// 		time: Date.now() - (100 * 1000),
// 	},
// 	{
// 		questionId: "q981",
// 		author: {
// 			userId: "u123",
// 			nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
// 			avatar: "https://picsum.photos/id/375/200/200",
// 			admin: true,
// 			premium: true,
// 		},
// 		content: "lol this questions board is the bestest",
// 		likeInfo: {
// 			likes: 999,
// 			liked: false,
// 		},
// 		time: Date.now() - (1000 * 1000 * 1000),
// 	},
// 	{
// 		questionId: "q678",
// 		author: {
// 			userId: "u456",
// 			nickname: "Donald Trump",
// 			avatar: "",
// 			admin: false,
// 			premium: false,
// 		},
// 		content: "Everybody needs a friend. Just think about these things in your mind - then bring them into your world. We'll have a super time. Play with the angles. Think about a cloud. Just float around and be there.\n\nI sincerely wish for you every possible joy life could bring. We're trying to teach you a technique here and how to use it. Nice little clouds playing around in the sky.\n\nMaking all those little fluffies that live in the clouds. You better get your coat out, this is going to be a cold painting. Everything's not great in life, but we can still find beauty in it. If these lines aren't straight, your water's going to run right out of your painting and get your floor wet. Every highlight needs it's own personal shadow.",
// 		likeInfo: {
// 			likes: 420,
// 			liked: false,
// 		},
// 		time: Date.now() - (500 * 1000),
// 	},
// ]
