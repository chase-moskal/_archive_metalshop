
import {
	Profile,
	AuthTokens,
	AccessToken,
	TokenStorageTopic,
	VimeoGovernorTopic,
	PaywallGuardianTopic,
	ProfileMagistrateTopic,
	AccessPayload,
	RefreshToken,
	User,
	ClaimsDealerTopic,
} from "authoritarian/dist/interfaces.js"

import {TokenData} from "redcrypto/dist/interfaces.js"
import {tokenDecode} from "redcrypto/dist/token-decode.js"

import {nap} from "../toolbox/nap.js"

import {
	Question,
	QuestionDraft,
	LoginPopupRoutine,
	ScheduleSentryTopic,
	QuestionsBureauTopic,
	LikeInfo,
	QuestionsBureauActions,
	QuestionRecord,
} from "../interfaces.js"
import { generateId } from "source/toolbox/generate-id.js"

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
			state.admin = false
			state.premium = false
			return state.tokens.accessToken
		},
	}

	function createMockQuestionsActions(): QuestionsBureauActions {
		const data: {
			records: QuestionRecord[]
		} = {records: []}

		async function getRecordById(questionId: string): Promise<QuestionRecord> {
			return data.records.find(record => (
				record.questionId === questionId
			))
		}

		async function fetchRecords(boardName: string): Promise<QuestionRecord[]> {
			return [...data.records.filter(record => (
				!record.archive &&
				record.boardName === boardName
			))]
		}

		async function saveRecord(
			record: QuestionRecord
		): Promise<void> {
			const already = await getRecordById(record.questionId)
			if (already) throw new Error(`cannot overwrite existing question`)
			else data.records.push(record)
		}

		async function likeRecord({like, userId, questionId}: {
			like: boolean
			userId: string
			questionId: string
		}): Promise<QuestionRecord> {
			const record = await getRecordById(questionId)
			if (like) {
				const alreadyLike = !!record.likes.find(like => like.userId === userId)
				if (!alreadyLike)
					record.likes.push({userId})
			}
			else {
				record.likes = record.likes.filter(like => like.userId !== userId)
			}
			await saveRecord(record)
			return record
		}

		async function trashRecord(questionId: string): Promise<void> {
			const record = await getRecordById(questionId)
			record.archive = true
			await saveRecord(record)
		}

		return {
			getRecordById,
			fetchRecords,
			likeRecord,
			saveRecord,
			trashRecord,
		}
	}

	async function mockTokenVerify(
		token: AccessToken
	): Promise<TokenData<AccessPayload>> {
		return tokenDecode(token)
	}

	function createQuestionsBureau({
		actions,
		verifyToken,
		claimsDealer,
		profileMagistrate,
	}: {
		actions: QuestionsBureauActions
		claimsDealer: ClaimsDealerTopic
		profileMagistrate: ProfileMagistrateTopic
		verifyToken: (token: AccessToken) => Promise<TokenData<AccessPayload>>
	}) {

		async function resolveQuestion(
			record: QuestionRecord
		): Promise<Question> {
			const {authorUserId: userId} = record
			const author = {
				user: await claimsDealer.getUser({userId}),
				profile: await profileMagistrate.getProfile({userId}),
			}
			const likeInfo: LikeInfo = {
				likes: record.likes.length,
				liked: !!record.likes.find(like => like.userId === userId),
			}
			return {
				author,
				likeInfo,
				time: record.time,
				content: record.content,
				questionId: record.questionId,
			}
		}

		async function fetchQuestions({boardName}: {
			boardName: string
		}): Promise<Question[]> {
			const records = await actions.fetchRecords(boardName)
			return await Promise.all(
				records.map(record => resolveQuestion(record))
			)
		}

		async function postQuestion({boardName, draft, accessToken}: {
			boardName: string
			draft: QuestionDraft
			accessToken: AccessToken
		}): Promise<Question> {
			const {user} = (await verifyToken(accessToken)).payload
			const {userId: authorUserId} = user
			if (!user.claims.premium)
				throw new Error(`must be premium to post question`)
			const record: QuestionRecord = {
				boardName,
				authorUserId,
				likes: [],
				archive: false,
				time: Date.now(),
				content: draft.content,
				questionId: generateId(),
			}
			await actions.saveRecord(record)
			return await resolveQuestion(record)
		}

		async function deleteQuestion({questionId, accessToken}: {
			questionId: string
			accessToken: AccessToken
		}): Promise<void> {
			const {user} = (await verifyToken(accessToken)).payload
			const record = await actions.getRecordById(questionId)

			const owner = user.userId === record.authorUserId
			const admin = !!user.claims.admin

			if (owner || admin)
				await actions.trashRecord(questionId)
			else
				throw new Error(`must own the question to trash it`)
		}

		async function likeQuestion({like, questionId, accessToken}: {
			like: boolean
			questionId: string
			accessToken: AccessToken
		}): Promise<Question> {
			const {user} = (await verifyToken(accessToken)).payload
			const record = await actions.likeRecord({
				like,
				questionId,
				userId: user.userId,
			})
			return await resolveQuestion(record)
		}

		return {
			fetchQuestions,
			postQuestion,
			deleteQuestion,
			likeQuestion,
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

	const questionsBureau = createQuestionsBureau({
		claimsDealer,
		profileMagistrate,
		verifyToken: mockTokenVerify,
		actions: createMockQuestionsActions(),
	})

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
