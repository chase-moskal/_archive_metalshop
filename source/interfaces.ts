
import {
	User,
	Profile,
	Question,
	Settings,
	AuthTokens,
	AccessToken,
	ScheduleEvent,
	QuestionDraft,
	AuthDealerTopic,
	TokenStoreTopic,
	PaywallLiaisonTopic,
	ScheduleSentryTopic,
	SettingsSheriffTopic,
	QuestionsBureauTopic,
	LiveshowGovernorTopic,
	ProfileMagistrateTopic,
} from "authoritarian/dist/interfaces.js"

import {AuthModel} from "./models/auth-model.js"
import {DetailsModel} from "./models/details-model.js"
import {PaywallModel} from "./models/paywall-model.js"
import {ScheduleModel} from "./models/schedule-model.js"
import {QuestionsModel} from "./models/questions-model.js"
import {LiveshowViewModel, LiveshowModel} from "./models/liveshow-model.js"

import * as loading from "./toolbox/loading.js"
import {CSSResult, CSSResultArray} from "lit-element"
import {Logger} from "authoritarian/dist/toolbox/logger/interfaces.js"

export interface MetalConfig {
	["mock"]: string
	["auth-server"]: string
	["profile-server"]: string
	["paywall-server"]: string
	["schedule-server"]: string
	["liveshow-server"]: string
	["questions-server"]: string
}

export type CSS = CSSResult | CSSResultArray
export type ConstructorFor<T extends {} = {}> = new(...args: any[]) => T

export interface MetalOptions {
	logger: Logger
	authDealer: AuthDealerTopic
	tokenStore: TokenStoreTopic
	paywallLiaison: PaywallLiaisonTopic
	scheduleSentry: ScheduleSentryTopic
	settingsSheriff: SettingsSheriffTopic
	questionsBureau: QuestionsBureauTopic
	liveshowGovernor: LiveshowGovernorTopic
	profileMagistrate: ProfileMagistrateTopic
	//—
	decodeAccessToken: DecodeAccessToken
	triggerAccountPopup: TriggerAccountPopup
	triggerCheckoutPopup: TriggerCheckoutPopup
}

export interface AuthContext {
	user: User
	exp: number
	accessToken: AccessToken
}

export type GetAuthContext = () => Promise<AuthContext>
export type TriggerAccountPopup = () => Promise<AuthTokens>
export type DecodeAccessToken = (accessToken: AccessToken) => AuthContext
export type TriggerCheckoutPopup = (o: {stripeSessionId: string}) => Promise<void>

export interface LoginWithAccessToken {
	(accessToken: AccessToken): Promise<void>
}

export interface LoginDetail {
	getAuthContext: GetAuthContext
}

export interface QuestionValidation {
	angry: boolean
	message: string
	postable: boolean
}

export interface QuestionsBureauUi {
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
	purgeQuestions(o: {board: string}): Promise<void>
}

export type PrepareHandleLikeClick = (o: {
	like: boolean
	questionId: string
}) => (event: MouseEvent) => void

//
// supermodel
//

export interface Supermodel {
	auth: AuthModel
	details: DetailsModel
	paywall: PaywallModel
	schedule: ScheduleModel
	liveshow: LiveshowModel
	questions: QuestionsModel
}

export enum AuthMode {
	Error,
	Loading,
	LoggedIn,
	LoggedOut,
}

export interface AuthUpdate {
	user: User
	mode: AuthMode
	getAuthContext: GetAuthContext
}

export enum ProfileMode {
	Error,
	Loading,
	Loaded,
	None,
}

export enum BillingStatus {
	Unlinked,
	Linked,
}

export enum PremiumStatus {
	NotPremium,
	Premium,
}

export enum PrivilegeMode {
	Unknown,
	Unprivileged,
	Privileged,
}

export type ReceiveGetAuthContext = (getAuthContext: GetAuthContext) => void

//
// component shares
//

export interface AccountShare {
	user: User
	mode: AuthMode
	login: () => Promise<void>
	logout: () => Promise<void>
	getAuthContext: GetAuthContext
}

export interface MyAvatarShare {
	profile: Profile
	premiumStatus: PremiumStatus
}

export interface AdminModeShare {
	user: User
	settingsLoad: loading.Load<Settings>
	setAdminMode(inputs: {adminMode: boolean}): Promise<Settings>
}

export interface AdminOnlyShare {
	user: User
	settingsLoad: loading.Load<Settings>
}

export interface DetailsShare {
	user: User
	profileLoad: loading.Load<Profile>
	settingsLoad: loading.Load<Settings>
	saveProfile: (profile: Profile) => Promise<void>
}

export interface ProfileShare {
	user: User
	profile: Profile
	mode: ProfileMode
	displayAdminFeatures: boolean
	loadProfile: () => Promise<Profile>
	saveProfile: (profile: Profile) => Promise<void>
}

export interface PaywallShare {
	user: User
	profile: Profile
	authMode: AuthMode
	// autoRenew: boolean
	// premiumStatus: PremiumStatus
	// billingStatus: BillingStatus
	// linkCard(): Promise<void>
	// unlinkCard(): Promise<void>
	// premiumSubscribe(): Promise<void>
	// premiumSetAutoRenew(): Promise<void>
}

export interface QuestionsShare {
	user: User
	profile: Profile
	uiBureau: QuestionsBureauUi
	fetchCachedQuestions(board: string): Question[]
}

export interface CountdownShare {
	user: User
	profile: Profile
	events: {[key: string]: ScheduleEvent}
	loadEvent: (name: string) => Promise<ScheduleEvent>
	saveEvent: (name: string, event: ScheduleEvent) => Promise<void>
}

export interface LiveshowShare {
	user: User
	authMode: AuthMode
	getAuthContext: GetAuthContext
	makeViewModel(options: {videoName: string}): {
		dispose: () => void
		viewModel: LiveshowViewModel
	}
}
