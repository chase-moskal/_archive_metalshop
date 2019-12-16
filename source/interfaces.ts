
import {
	User,
	Profile,
	AuthTokens,
	AccessToken,
	TokenStorageTopic,
	PaywallGuardianTopic,
	ProfileMagistrateTopic,
	PrivateVimeoGovernorTopic,
} from "authoritarian/dist/interfaces.js"

import {UserMode} from "./models/user-model.js"
import {PaywallMode} from "./models/paywall-model.js"
import {PrivilegeMode} from "./models/private-vimeo-model.js"
import {Reader, Pubsubs, Pubsub, Subscribe} from "./toolbox/pubsub.js"

export interface AuthoritarianConfig {
	mock: string
	authServer: string
	profileServer: string
	paywallServer: string
	privateVimeoServer: string
	questionsForumServer: string
}

export interface AuthoritarianOptions {
	tokenStorage: TokenStorageTopic
	paywallGuardian: PaywallGuardianTopic
	questionsBureau: QuestionsBureauTopic
	profileMagistrate: ProfileMagistrateTopic
	privateVimeoGovernor: PrivateVimeoGovernorTopic

	loginPopupRoutine: LoginPopupRoutine
	decodeAccessToken: DecodeAccessToken
}

export interface AuthContext {
	user: User
	exp: number
	accessToken: AccessToken
}

export type GetAuthContext = () => Promise<AuthContext>
export type AccountPopupLogin = (authServerUrl: string) => Promise<AuthTokens>
export type LoginPopupRoutine = () => Promise<AuthTokens>
export type DecodeAccessToken = (accessToken: AccessToken) => AuthContext

export type ConstructorFor<T extends {} = {}> = new(...args: any[]) => T

export interface SimpleModel {
	reader: Reader
}

export interface UserState {
	mode: UserMode
	getAuthContext: GetAuthContext
}

export type UserUpdate = (state: UserState) => void

export type UserReader = Reader<UserState>

export interface UserModel {
	reader: UserReader
	start: () => Promise<void>
	login: () => Promise<void>
	logout: () => Promise<void>
	receiveLoginWithAccessToken: (accessToken: AccessToken) => Promise<void>
}

export interface PaywallState {
	mode: PaywallMode
}

export interface LoginWithAccessToken {
	(accessToken: AccessToken): Promise<void>
}

export interface PaywallReader extends Reader<PaywallState> {}

export interface PaywallModel {
	reader: Reader<PaywallState>
	update(): void
	makeUserPremium(): Promise<void>
	revokeUserPremium(): Promise<void>
	receiveUserUpdate(state: UserState): Promise<void>
	subscribeLoginWithAccessToken: Subscribe<LoginWithAccessToken>
}

export interface LoginDetail {
	getAuthContext: GetAuthContext
}

export interface ProfileEvents extends Pubsubs {
	stateUpdate: Pubsub
}

export interface ProfileModel {
	reader: Reader<ProfileState>
	update(): void
	subscribeReset: Subscribe
	saveProfile(profile: Profile): Promise<void>
	receiveUserUpdate(state: UserState): Promise<void>
}

export interface ProfileState {
	error: Error
	admin: boolean
	premium: boolean
	loading: boolean
	profile: Profile
}

export interface AvatarWiring {
	update: () => void
	setPictureUrl(url: string): void
	setPremium(premium: boolean): void
}

export interface WebComponent extends HTMLElement {
	adoptedCallback?(): void
	connectedCallback?(): void
	disconnectedCallback?(): void
	attributeChangedCallback?(
		name: string,
		oldValue: string,
		newValue: string
	): void
}

export interface VimeoState {
	vimeoId: string
	loading: boolean
	mode: PrivilegeMode
	errorMessage: string
	validationMessage: string
}

export interface VimeoModel {
	reader: Reader<VimeoState>
	updateVideo(vimeostring: string): Promise<void>
	receiveUserUpdate(state: UserState): Promise<void>
}

export interface QuestionAuthor {
	userId: string
	picture: string
	premium: boolean
	nickname: string
}

export interface QuestionDraft {
	time: number
	content: string
	author: QuestionAuthor
	comments: QuestionComment[]
}

export interface QuestionCommentDraft {
	content: string
	author: QuestionAuthor
}

export interface QuestionComment extends QuestionCommentDraft {
	commentId: string
}

export interface Question extends QuestionDraft {
	likes: number
	liked: boolean
	questionId: string
}

export interface QuestionsState {
	user: User
	profile: Profile
	forums: {
		[forumName: string]: {
			questions: Question[]
		}
	}
}

export interface QuestionsModel {
	reader: Reader<QuestionsState>
	bureau: QuestionsBureauTopic
	updateProfile(profile: Profile): void
	receiveUserUpdate(state: UserState): Promise<void>
}

export interface QuestionsBureauTopic {
	fetchQuestions(o: {forumName: string}): Promise<Question[]>

	postQuestion(o: {
		forumName: string
		question: QuestionDraft
	}): Promise<Question>

	deleteQuestion(o: {
		forumName: string
		questionId: string
	}): Promise<void>

	postComment(o: {
		forumName: string
		questionId: string
		comment: QuestionCommentDraft
	}): Promise<QuestionComment>

	deleteComment(o: {
		forumName: string
		questionId: string
		commentId: string
	}): Promise<void>

	likeQuestion(o: {
		like: boolean
		forumName: string
		questionId: string
		accessToken: AccessToken
	}): Promise<number>
}
