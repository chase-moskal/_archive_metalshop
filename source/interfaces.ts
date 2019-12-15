
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

import {PaywallMode} from "./models/paywall-model.js"
import {PrivilegeMode} from "./models/private-vimeo-model.js"

import {UserPanel} from "./components/user-panel.js"
import {ProfilePanel} from "./components/profile-panel.js"
import {PaywallPanel} from "./components/paywall-panel.js"
import {PrivateVimeo} from "./components/private-vimeo.js"
import {AvatarDisplay} from "./components/avatar-display.js"
import {QuestionsForum} from "./components/questions-forum.js"

export interface AuthoritarianConfig {
	mock: string
	debug: boolean

	authServer: string
	profileServer: string
	paywallServer: string
	privateVimeoServer: string
	questionsForumServer: string
}

export interface AuthoritarianOptions {
	debug: boolean

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

export interface AuthModel {
	reader: Reader
}

export interface UserState {
	error: Error
	loading: boolean
	loggedIn: boolean
}

export interface UserEvents extends Pubsubs {
	userLoading: Pubsub<() => void>
	userLogin: Pubsub<(auth: LoginDetail) => void>
	userError: Pubsub<(error: Error) => void>
	userLogout: Pubsub<() => void>
}

export interface UserEventSubscribers extends Subify<UserEvents> {}

export type UserReader = Reader<UserState>

export interface UserModel {
	reader: UserReader
	subscribers: UserEventSubscribers
	wiring: {
		publishStateUpdate: () => void
		start: () => Promise<void>
		loginWithAccessToken: (accessToken: AccessToken) => Promise<void>
	},
	actions: {
		login: () => Promise<void>
		logout: () => Promise<void>
	}
}

export interface PaywallState {
	mode: PaywallMode
}

export interface LoginWithAccessToken {
	(accessToken: AccessToken): Promise<void>
}

export interface PaywallEvents extends Pubsubs {
	loginWithAccessToken: Pubsub<LoginWithAccessToken>
}

export interface PaywallReader extends Reader<PaywallState> {}
export interface PaywallActions {
	makeUserPremium: () => Promise<void>
	revokeUserPremium: () => Promise<void>
}

export interface PaywallWiring {
	publishStateUpdate: () => void
	loginWithAccessToken: Subscribe<LoginWithAccessToken>
	receiveUserLogin: (o: {getAuthContext: GetAuthContext}) => Promise<void>
	receiveUserLogout: () => Promise<void>
}

export interface PaywallModel {
	wiring: PaywallWiring
	actions: PaywallActions
	reader: Reader<PaywallState>
}

export interface LoginDetail {
	getAuthContext: GetAuthContext
}

export interface ProfileEvents extends Pubsubs {
	stateUpdate: Pubsub
}

export interface ProfileModel {
	reader: Reader<ProfileState>
	subscribeReset: Subscribe
	actions: {
		saveProfile: (profile: Profile) => Promise<void>
	},
	wiring: {
		publishStateUpdate: () => void
		receiveUserLogout: () => Promise<void>
		receiveUserLoading: () => Promise<void>
		receiveUserLogin: (detail: LoginDetail) => Promise<void>
	}
}

export interface ProfileState {
	error: Error
	admin: boolean
	premium: boolean
	loading: boolean
	profile: Profile
}

export interface AvatarWiring {
	publishStateUpdate: () => void
	setPictureUrl(url: string): void
	setPremium(premium: boolean): void
}

export type AnyListener = (...args: any) => void | Promise<void>

export interface Unsubscribe {
	(): void
}

export interface Subscribe<Listener extends AnyListener = AnyListener> {
	(func: Listener): Unsubscribe
}

export interface Pubsub<Listener extends AnyListener = AnyListener> {
	publish: Listener
	subscribe: Subscribe<Listener>
}

export interface Pubsubs {
	[key: string]: Pubsub
}

export type Pubify<P extends Pubsubs> = {
	[K in keyof P]: P[K]["publish"]
}

export type Subify<P extends Pubsubs> = {
	[K in keyof P]: P[K]["subscribe"]
}

export interface Reader<S extends {} = {}> {
	state: Readonly<S>
	subscribe: Subscribe<(state: S) => void>
}

export interface ReaderContext<S extends {} = {}> {
	reader: Reader<S>
	publishStateUpdate: () => void
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
	actions: {
		updateVideo(vimeostring: string): Promise<void>
	}
	wiring: {
		receiveUserLoading(): Promise<void>
		receiveUserLogin(detail: LoginDetail): Promise<void>
		receiveUserLogout(): Promise<void>
	}
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
	actions: QuestionsBureauTopic
	wiring: {
		receiveUserLogin(detail: LoginDetail): Promise<void>
		receiveUserLogout(): Promise<void>
		updateProfile(profile: Profile): void
	}
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

export interface Supermodel {
	userModel: UserModel
	paywallModel: PaywallModel
	profileModel: ProfileModel
	vimeoModel: VimeoModel
	questionsModel: QuestionsModel
	start(): Promise<void>
}
