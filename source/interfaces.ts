
import {User, AccessToken, AuthTokens} from "authoritarian/dist/interfaces.js"

import {PaywallMode} from "./models/paywall-model.js"

export interface AuthContext {
	user: User
	exp: number
	accessToken: AccessToken
}

export type GetAuthContext = () => Promise<AuthContext>
export type AccountPopupLogin = (authServerUrl: string) => Promise<AuthTokens>
export type DecodeAccessToken = (accessToken: AccessToken) => AuthContext

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
