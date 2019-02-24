
import {AccessToken, AccessData, TokenApi, LoginApi} from "authoritarian"

import {AuthStore} from "./stores/auth-store"

/** Handle the reception of an access token */
export type HandleAccessToken = (accessToken?: AccessToken) => void

/** Handle the reception of decoded access data */
export type HandleAccessData = (accessData: AccessData) => void

/** Decode access data out of an access token */
export type DecodeAccessToken = (accessToken: AccessToken) => AccessData

export type HandleUserLogin = () => void
export type HandleUserLogout = () => void

export interface AuthSlateProps {
	authStore: AuthStore
	handleUserLogin: () => void
	handleUserLogout: () => void
}

/** Fundamental services for the auth machinery to operate */
export interface AuthMachineFundamentals {
	tokenApi: TokenApi
	loginApi: LoginApi
	decodeAccessToken: DecodeAccessToken
}

export interface RenderAuthSlateOptions extends AuthSlateProps {
	element: Element
}

export interface AuthController {
	authStore: AuthStore
	logout: () => Promise<void>
	passiveCheck: () => Promise<void>
	promptUserLogin: () => Promise<void>
}
