
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

import {PaywallMode} from "../models/paywall-model.js"
import {PrivilegeMode} from "../models/private-vimeo-model.js"

import {UserPanel} from "../components/user-panel.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {PrivateVimeo} from "../components/private-vimeo.js"
import {AvatarDisplay} from "../components/avatar-display.js"

export interface AuthoritarianConfig {
	mock: string
	debug: boolean

	authServer: string
	profilerService: string
	paywallGuardian: string
	privateVimeoServer: string
}

export interface AuthoritarianOptions {
	debug: boolean

	tokenStorage: TokenStorageTopic
	paywallGuardian: PaywallGuardianTopic
	profileMagistrate: ProfileMagistrateTopic
	privateVimeoGovernor: PrivateVimeoGovernorTopic

	loginPopupRoutine: LoginPopupRoutine
	decodeAccessToken: DecodeAccessToken

	userPanels: UserPanel[]
	profilePanels: ProfilePanel[]
	paywallPanels: PaywallPanel[]
	privateVimeos: PrivateVimeo[]
	avatarDisplays: AvatarDisplay[]
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

export interface AvatarState {
	url: string
	premium: boolean
}

export interface AvatarReader extends Reader<AvatarState> {}

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
