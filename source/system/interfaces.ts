
import {
	User,
	AuthTokens,
	AccessToken,
	ProfilerTopic,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"
import {PaywallMode} from "../models/paywall-model.js"
import {UserPanel} from "../components/user-panel.js"
import {UserButton} from "../components/user-button.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"

export interface AuthoritarianConfig {
	mock: boolean
	debug: boolean

	authServer: string
	profilerService: string
	paywallGuardian: string
}

export interface AuthoritarianOptions {
	debug: boolean

	profiler: ProfilerTopic
	tokenStorage: TokenStorageTopic
	paywallGuardian: PaywallGuardianTopic

	loginPopupRoutine: LoginPopupRoutine
	decodeAccessToken: DecodeAccessToken

	userPanels: UserPanel[]
	eventTarget: EventTarget
	userButtons: UserButton[]
	profilePanels: ProfilePanel[]
	paywallPanels: PaywallPanel[]
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

export interface UserEvents extends Pubsubs {
	userLoading: Pubsub<() => void>
	userLogin: Pubsub<(auth: LoginDetail) => void>
	userError: Pubsub<(error: Error) => void>
	userLogout: Pubsub<() => void>
}

export interface UserModel {
	events: Subify<UserEvents>
	actions: {
		start: () => Promise<void>
		login: () => Promise<void>
		logout: () => Promise<void>
		loginWithAccessToken: (accessToken: AccessToken) => Promise<void>
	}
}

export interface PaywallState {
	mode: PaywallMode
}

export interface LoginWithAccessToken {
	(accessToken: AccessToken): Promise<void>
}

export interface PaywallEvents extends Pubsubs {
	stateUpdate: Pubsub
	loginWithAccessToken: Pubsub<LoginWithAccessToken>
}

export interface PaywallModel {
	reader: Reader<PaywallState, Subscribe<() => void>>
	actions: {
		makeUserPremium: () => Promise<void>
		revokeUserPremium: () => Promise<void>
	}
	wiring: {
		loginWithAccessToken: Subscribe<LoginWithAccessToken>
		notifyUserLogin: (o: {getAuthContext: GetAuthContext}) => Promise<void>
		notifyUserLogout: () => Promise<void>
	}
}

export interface LoginDetail {
	getAuthContext: GetAuthContext
}

export interface AvatarState {
	url: string
	premium: boolean
}

export type AvatarListener = () => void
export type AvatarScribe = Subscribe<AvatarListener>
export interface AvatarReader extends Reader<AvatarState, AvatarScribe> {}

export interface AvatarActions {
	setPictureUrl(url: string): void
	setPremium(premium: boolean): void
}

export type AnyListener = (...args: any) => void | Promise<void>

export interface Unsubscribe<Listener extends AnyListener = AnyListener> {
	(func: Listener): void
}

export interface Subscribe<Listener extends AnyListener = AnyListener> {
	(func: Listener): Unsubscribe<Listener>
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

export interface Reader<
	State extends {} = {},
	S extends Subscribe = Subscribe
> {
	state: Readonly<State>
	subscribe: S
}
