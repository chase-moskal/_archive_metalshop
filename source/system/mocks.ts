
import {
	Profile,
	AuthTokens,
	AccessToken,
	AccessPayload,
	RefreshPayload,
	TokenStorageTopic,
	PaywallGuardianTopic,
	ProfileMagistrateTopic,
	PrivateVimeoGovernorTopic,
} from "authoritarian/dist/interfaces.js"
import {signToken} from "authoritarian/dist/crypto.js"

import {
	Question,
	AuthContext,
	QuestionDraft,
	QuestionComment,
	LoginPopupRoutine,
	QuestionsBureauTopic,
	QuestionCommentDraft,
} from "../interfaces.js"

import {privateKey} from "./mock-keys.js"

const debug = (message: string) => null //console.debug(`mock: ${message}`)

const nap = (multiplier: number = 1) =>
	new Promise(resolve => setTimeout(resolve, multiplier * 250))

async function createMockAccessToken({
	expiresIn = "20m",
	publicClaims = {cool: true},
	privateClaims = {supercool: true},
}: {
	expiresIn?: string
	publicClaims?: Object
	privateClaims?: Object
} = {}) {
	debug("createMockAccessToken")
	return signToken<AccessPayload>({
		expiresIn,
		privateKey,
		payload: {
			user: {
				userId: "u123",
				public: {claims: publicClaims},
				private: {claims: privateClaims}
			}
		}
	})
}

async function createMockRefreshToken({expiresIn = "60d"}: {
	expiresIn?: string
} = {}) {
	debug("createMockRefreshToken")
	return signToken<RefreshPayload>({
		payload: {userId: "u123"},
		expiresIn,
		privateKey
	})
}

function once<T extends any>(
	handler: () => Promise<T>
): () => Promise<T> {
	let done = false
	let value: T
	return async() => {
		if (done) return value
		else {
			value = await handler()
			done = true
			return value
		}
	}
}

const getMockRefreshToken = once(() => createMockRefreshToken())
const getMockAccessToken = once(() => createMockAccessToken({
	publicClaims: {premium: false}
}))
const getMockPremiumAccessToken = once(() => createMockAccessToken({
	publicClaims: {premium: true}
}))
const getMockAdminAccessToken = once(() => createMockAccessToken({
	publicClaims: {admin: true, premium: true
}}))

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
		exp: (Date.now() / 1000) + 10,
		user: {
			userId: "u123",
			public: {claims: {premium: true}},
			private: {claims: {}}
		},
		accessToken
	})
}

export class MockPrivateVimeoGovernor implements PrivateVimeoGovernorTopic {
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
	public: {
		nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
		picture: "https://picsum.photos/id/375/200/200",
	},
	private: {
		realname: "Captain Branstock Dudley-Faddington",
	}
}

export class MockProfileMagistrate implements ProfileMagistrateTopic {
	private _profile: Profile

	constructor({profile = mockProfile}: {profile?: Profile} = {}) {
		this._profile = profile
	}

	async getPublicProfile({userId}): Promise<Profile> {
		debug("getPublicProfile")
		await nap()
		return {
			...this._profile,
			userId,
		}
	}

	async getFullProfile(options): Promise<Profile> {
		debug("getFullProfile")
		await nap()
		return this._profile
	}

	async setFullProfile({profile}): Promise<void> {
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

const mockQuestions: Question[] = [
	{
		questionId: "q123",
		author: {
			userId: "u345",
			nickname: "Johnny Texas",
			picture: "",
			premium: false,
		},
		content: "how is lord brim so cool?",
		comments: [
			{
				author: {
					userId: "u346",
					nickname: "superman420",
					picture: "",
					premium: false,
				},
				commentId: "qc1234",
				content: "pretty great board i must say"
			}
		],
		likes: 2,
		liked: false,
		time: Date.now() - (100 * 1000),
	},
	{
		questionId: "q123",
		author: {
			userId: "u123",
			nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
			picture: "https://picsum.photos/id/375/200/200",
			premium: true,
		},
		content: "lol this questions board is the bestest",
		comments: [
			{
				author: {
					userId: "u345",
					nickname: "Johnny Texas",
					picture: "",
					premium: false,
				},
				commentId: "qc123",
				content: "man you are so cool"
			},
			{
				author: {
					userId: "u345",
					nickname: "superman420",
					picture: "",
					premium: false,
				},
				commentId: "qc1234",
				content: "pretty great board i must say"
			},
			{
				author: {
					userId: "u345",
					nickname: "Donald Trump",
					picture: "",
					premium: false,
				},
				commentId: "qc123",
				content: "i make the best comments, nobody makes comments better than me"
			},
			{
				author: {
					userId: "u345",
					nickname: "anybody",
					picture: "",
					premium: false,
				},
				commentId: "qc123",
				content: "what're we gonna do lol?"
			},
			{
				author: {
					userId: "u345",
					nickname: "Johnny Texas",
					picture: "",
					premium: false,
				},
				commentId: "qc123",
				content: "man you are so cool"
			},
			{
				author: {
					userId: "u345",
					nickname: "superman420",
					picture: "",
					premium: false,
				},
				commentId: "qc1234",
				content: "pretty great form i must say"
			},
			{
				author: {
					userId: "u345",
					nickname: "Donald Trump",
					picture: "",
					premium: false,
				},
				commentId: "qc123",
				content: "i make the best comments, nobody makes comments better than me"
			},
			{
				author: {
					userId: "u345",
					nickname: "anybody",
					picture: "",
					premium: false,
				},
				commentId: "qc123",
				content: "what're we gonna do lol?"
			},
		],
		likes: 999,
		liked: true,
		time: Date.now() - (1000 * 1000 * 1000),
	},
	{
		questionId: "q678",
		author: {
			userId: "u456",
			nickname: "Donald Trump",
			picture: "",
			premium: false,
		},
		content: "this authoritarian system is the best, i have no doubts",
		comments: [],
		likes: 420,
		liked: false,
		time: Date.now() - (500 * 1000),
	},
]

export class MockQuestionsBureau implements QuestionsBureauTopic {
	async fetchQuestions(o: {boardName: string}): Promise<Question[]> {
		return mockQuestions
	}

	async postQuestion({question}: {
		boardName: string
		question: QuestionDraft
	}): Promise<Question> {
		return {...question, likes: 1, liked: true, questionId: `q${Math.random()}`}
	}

	async postComment({comment}: {
		boardName: string
		questionId: string
		comment: QuestionCommentDraft
	}): Promise<QuestionComment> {
		return {...comment, commentId: `qc${Math.random()}`}
	}

	async deleteQuestion(o: {
		boardName: string
		questionId: string
	}): Promise<void> {}

	async deleteComment(o: {
		boardName: string
		questionId: string
		commentId: string
	}): Promise<void> {}

	async likeQuestion(o) {
		return null
	}
}
