
import {
	Profile,
	AuthTokens,
	AccessToken,
	TokenStorageTopic,
	VimeoGovernorTopic,
	PaywallGuardianTopic,
	ProfileMagistrateTopic,
} from "authoritarian/dist/interfaces.js"

import {nap} from "../toolbox/nap.js"
import {once} from "../toolbox/once.js"

import {
	Question,
	AuthContext,
	QuestionDraft,
	LoginPopupRoutine,
	ScheduleSentryTopic,
	QuestionsBureauTopic,
} from "../interfaces.js"

const dist = "./dist"
const debugLogs = false

const debug = (message: string) => debugLogs
	? console.debug(`mock: ${message}`)
	: null

const getToken = async(name: string) => (await fetch(`${dist}/${name}`)).text()
const getMockAccessToken = once(() => getToken("mock-access.token"))
const getMockRefreshToken = once(() => getToken("mock-refresh.token"))
const getMockAdminAccessToken = once(() => getToken("mock-access-admin.token"))
const getMockPremiumAccessToken = once(
	() => getToken("mock-access-premium.token")
)

export const mockLoginPopupRoutine: LoginPopupRoutine = async() => {
	debug("mockLoginPopupRoutine")
	await nap()
	return {
		accessToken: await getMockAccessToken(),
		refreshToken: await getMockRefreshToken()
	}
}

export const mockDecodeAccessToken = (accessToken: AccessToken):
 AuthContext => {
	debug("mockDecodeAccessToken")
	return ({
		accessToken,
		exp: (Date.now() / 1000) + 10,
		user: {
			userId: "u123",
			claims: {premium: true},
		},
	})
}

export class MockVimeoGovernor implements VimeoGovernorTopic {
	private _vimeoId = "109943349"

	async getVimeo(options: {
		accessToken: AccessToken
		videoName: string
	}): Promise<{vimeoId: string}> {
		const {_vimeoId: vimeoId} = this
		return {vimeoId}
	}

	async setVimeo({vimeoId}: {
		accessToken: AccessToken
		vimeoId: string
		videoName: string
	}) {
		this._vimeoId = vimeoId
	}
}

export class MockTokenStorage implements TokenStorageTopic {
	async passiveCheck() {
		debug("passiveCheck")
		await nap()
		return getMockAccessToken()
	}
	async writeTokens(tokens: AuthTokens) {
		debug("writeTokens")
		await nap()
	}
	async writeAccessToken(accessToken: AccessToken) {
		debug("writeAccessToken")
		await nap()
	}
	async clearTokens() {
		debug("clearTokens")
		await nap()
	}
}

export class MockTokenStorageAdmin extends MockTokenStorage {
	async passiveCheck() {
		debug("passiveCheck admin")
		await nap()
		return getMockAdminAccessToken()
	}
}

export class MockTokenStorageLoggedOut extends MockTokenStorage {
	async passiveCheck() {
		debug("passiveCheck loggedout")
		await nap()
		return null
	}
}

export const mockProfile: Profile = {
	userId: "fake-h31829h381273h",
	nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
	avatar: "https://picsum.photos/id/375/200/200",
}

export class MockProfileMagistrate implements ProfileMagistrateTopic {
	private _profile: Profile

	constructor({profile = mockProfile}: {profile?: Profile} = {}) {
		this._profile = profile
	}

	async getProfile({userId}): Promise<Profile> {
		debug("getProfile")
		await nap()
		return {
			...this._profile,
			userId,
		}
	}

	async setProfile({profile}): Promise<void> {
		debug("setFullProfile")
		await nap()
		this._profile = profile
		return undefined
	}
}

export class MockPaywallGuardian implements PaywallGuardianTopic {
	async grantUserPremium(options: {accessToken: AccessToken}) {
		debug("grantUserPremium")
		await nap()
		return getMockPremiumAccessToken()
	}
	async revokeUserPremium(options: {accessToken: AccessToken}) {
		debug("revokeUserPremium")
		await nap()
		return getMockAccessToken()
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

export class MockQuestionsBureau implements QuestionsBureauTopic {
	private _questions: Question[] = []

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

export class MockScheduleSentry implements ScheduleSentryTopic {
	private _data: {[key: string]: number} = {}

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
