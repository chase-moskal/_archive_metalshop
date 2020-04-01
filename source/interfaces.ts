
import {
	User,
	Profile,
	Question,
	AuthTokens,
	AccessToken,
	QuestionDraft,
	AuthDealerTopic,
	TokenStorageTopic,
	QuestionsBureauTopic,
	PaywallGuardianTopic,
	LiveshowGovernorTopic,
	ProfileMagistrateTopic,
} from "authoritarian/dist/interfaces.js"

import {UserMode} from "./models/user-model.js"
import {PaywallMode} from "./models/paywall-model.js"
import {AuthModel} from "./supermodels/auth-model.js"
import {PrivilegeMode} from "./models/video-viewer-model.js"
import {ProfileModel} from "./supermodels/profile-model.js"
import {Reader, Pubsubs, Pubsub, Subscribe} from "./toolbox/pubsub.js"

export interface MetalConfig {
	mock: string
	authServer: string
	profileServer: string
	paywallServer: string
	scheduleServer: string
	liveshowServer: string
	questionsServer: string
}

export interface MetalOptions {
	authDealer: AuthDealerTopic
	tokenStorage: TokenStorageTopic
	scheduleSentry: ScheduleSentryTopic
	paywallGuardian: PaywallGuardianTopic
	questionsBureau: QuestionsBureauTopic
	liveshowGovernor: LiveshowGovernorTopic
	profileMagistrate: ProfileMagistrateTopic
	//—
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
	reader?: Reader
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

// export interface ProfileModel {
// 	reader: Reader<ProfileState>
// 	update(): void
// 	subscribeReset: Subscribe
// 	saveProfile(profile: Profile): Promise<void>
// 	receiveUserUpdate(state: UserState): Promise<void>
// }

export interface ProfileState {
	error: Error
	admin: boolean
	premium: boolean
	loading: boolean
	profile: Profile
	adminClaim: boolean
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

export interface VideoModel extends SimpleModel {
	reader: Reader<VimeoState>
	updateVideo(vimeostring: string): Promise<void>
	receiveUserUpdate(state: UserState): Promise<void>
}

export interface VideoViewerModel extends SimpleModel {
	prepareVideoModel: (options: {videoName: string}) => VideoModel
}

export interface QuestionsState {
	user: User
	profile: Profile
	questions: Question[]
}

export interface QuestionsModel {
	reader: Reader<QuestionsState>
	bureau: QuestionsBureauUi
	fetchLocalQuestions: (board: string) => Question[]
	updateProfile(profile: Profile): void
	receiveUserUpdate(state: UserState): Promise<void>
}

export interface QuestionValidation {
	angry: boolean
	message: string
	postable: boolean
}

export interface QuestionsBureauUi extends QuestionsBureauTopic {

	fetchQuestions(o: {
		board: string
	}): Promise<Question[]>

	postQuestion(o: {
		draft: QuestionDraft
	}): Promise<Question>

	deleteQuestion(o: {
		questionId: string
	}): Promise<void>

	likeQuestion(o: {
		like: boolean
		questionId: string
	}): Promise<Question>
}

export type PrepareHandleLikeClick = (o: {
	like: boolean
	questionId: string
}) => (event: MouseEvent) => void

export interface ScheduleSentryTopic {
	getEventTime(key: string): Promise<number>
	setEventTime(key: string, time: number): Promise<void>
}

export interface CountdownState {
	admin: boolean
	eventTime: number
	validationMessage: string
}

export interface CountdownModel {
	reader: Reader<CountdownState>
	refreshEventTime(): Promise<void>
	setEventTime(time: number): Promise<void>
	receiveUserUpdate(options: UserState): Promise<void>
}

export interface ScheduleModel extends SimpleModel {
	prepareCountdownModel(options: {key: string}): CountdownModel
}

//
// supermodel
//

export interface Supermodel {
	auth: AuthModel
	profile: ProfileModel
}

export enum ProfileMode {
	Error,
	Loading,
	Loaded,
	None,
}

export enum AuthMode {
	Error,
	Loading,
	LoggedIn,
	LoggedOut,
}

export interface AuthUpdate {
	mode: AuthMode
	getAuthContext: GetAuthContext
}

//
// component shares
//

export interface AccountShare {
	mode: AuthMode
	getAuthContext: GetAuthContext
}

export interface ProfileShare {
	profile: Profile
	mode: ProfileMode
	displayAdminFeatures: boolean
	loadProfile: () => Promise<Profile>
	saveProfile: (profile: Profile) => Promise<void>
}
