
import {
	Profile,
	AuthTokens,
	AccessToken,
	TokenStorageTopic,
	VimeoGovernorTopic,
	PaywallGuardianTopic,
	ProfileMagistrateTopic,
	RefreshToken,
} from "authoritarian/dist/interfaces.js"

import {nap} from "../toolbox/nap.js"

import {
	Question,
	QuestionDraft,
	LoginPopupRoutine,
	ScheduleSentryTopic,
	QuestionsBureauTopic,
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
	admin,
	premium,
	mockTokens,
	startLoggedIn,
}: {
	admin: boolean
	premium: boolean
	mockTokens: MockTokens
	startLoggedIn: boolean
}) => {

	const state = {
		loggedIn: startLoggedIn,
		profile: <Profile>{
			userId: "fake-h31829h381273h",
			nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
			avatar: "https://picsum.photos/id/375/200/200",
		},
		tokens: <AuthTokens>{
			get accessToken() {
				return state.loggedIn
					? admin
						? mockTokens.adminAccessToken
						: premium
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

	const loginPopupRoutine: LoginPopupRoutine = async() => {
		debug("loginPopupRoutine")
		await nap()
		state.loggedIn = true
		const {accessToken, refreshToken} = state.tokens
		return {accessToken, refreshToken}
	}

	let vimeoId = "109943349"
	const vimeoGovernor: VimeoGovernorTopic = {
		async getVimeo(options: {
			accessToken: AccessToken
			videoName: string
		}): Promise<{vimeoId: string}> {
			return {vimeoId}
		},
		async setVimeo({vimeoId}: {
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
			state.premium = false
			return state.tokens.accessToken
		},
	}

	const questionsBureau = new class MockQuestionsBureau implements QuestionsBureauTopic {
		_questions: Question[] = []

		constructor({questions = [...mockQuestions]}: {questions?: Question[]} = {}) {
			this._questions = questions
		}

		async fetchQuestions(o: {boardName: string}): Promise<Question[]> {
			await nap()
			return [...this._questions]
		}
	
		async postQuestion({question}: {
			boardName: string
			question: QuestionDraft
		}): Promise<Question> {
			await nap()
			const legitQuestion: Question = {
				...question,
				likeInfo: {likes: 1, liked: true},
				questionId: `q${Math.random()}`
			}
			this._questions.push(legitQuestion)
			return legitQuestion
		}

		async deleteQuestion({boardName, questionId}: {
			boardName: string
			questionId: string
		}): Promise<void> {
			await nap()
			this._questions = this._questions
				.filter(question => question.questionId !== questionId)
		}

		async likeQuestion({like, boardName, questionId, accessToken}: {
			like: boolean
			boardName: string
			questionId: string
			accessToken: AccessToken
		}): Promise<number> {
			await nap()
			const question = this._questions.find(q => q.questionId === questionId)
			if (like) {
				question.likeInfo.likes += 1
				question.likeInfo.liked = true
			}
			else {
				question.likeInfo.likes -= 1
				question.likeInfo.liked = false
			}
			return question.likeInfo.likes
		}
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
		tokenStorage,
		vimeoGovernor,
		scheduleSentry,
		questionsBureau,
		paywallGuardian,
		loginPopupRoutine,
		profileMagistrate,
	}
}

export const mockQuestions: Question[] = [
	{
		questionId: "q123",
		author: {
			userId: "u345",
			nickname: "Johnny Texas",
			avatar: "",
			admin: false,
			premium: false,
		},
		content: "how is lord brim so cool?",
		likeInfo: {
			likes: 2,
			liked: false,
		},
		time: Date.now() - (100 * 1000),
	},
	{
		questionId: "q981",
		author: {
			userId: "u123",
			nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
			avatar: "https://picsum.photos/id/375/200/200",
			admin: true,
			premium: true,
		},
		content: "lol this questions board is the bestest",
		likeInfo: {
			likes: 999,
			liked: false,
		},
		time: Date.now() - (1000 * 1000 * 1000),
	},
	{
		questionId: "q678",
		author: {
			userId: "u456",
			nickname: "Donald Trump",
			avatar: "",
			admin: false,
			premium: false,
		},
		content: "Everybody needs a friend. Just think about these things in your mind - then bring them into your world. We'll have a super time. Play with the angles. Think about a cloud. Just float around and be there.\n\nI sincerely wish for you every possible joy life could bring. We're trying to teach you a technique here and how to use it. Nice little clouds playing around in the sky.\n\nMaking all those little fluffies that live in the clouds. You better get your coat out, this is going to be a cold painting. Everything's not great in life, but we can still find beauty in it. If these lines aren't straight, your water's going to run right out of your painting and get your floor wet. Every highlight needs it's own personal shadow.",
		likeInfo: {
			likes: 420,
			liked: false,
		},
		time: Date.now() - (500 * 1000),
	},
]
