
import {
	User,
	AuthTokens,
	AccessToken,
	ProfilerTopic,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"
import {PaywallMode} from "./models/paywall-model.js"
import {UserPanel} from "./components/user-panel.js"
import {UserButton} from "./components/user-button.js"
import {ProfilePanel} from "./components/profile-panel.js"
import {PaywallPanel} from "./components/paywall-panel.js"

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

export interface UserModel {
	start: () => Promise<void>
	login: () => Promise<void>
	logout: () => Promise<void>
	loginWithAccessToken: (accessToken: AccessToken) => Promise<void>
}

export interface PaywallState {
	mode: PaywallMode
}

export interface PaywallPanelAccess {
	state: PaywallState
	actions: {
		makeUserPremium: () => Promise<void>
		revokeUserPremium: () => Promise<void>
	}
}

export interface PaywallAppAccess {
	actions: {
		notifyUserLogin: (o: {getAuthContext: GetAuthContext}) => Promise<void>
		notifyUserLogout: () => Promise<void>
	}
}
