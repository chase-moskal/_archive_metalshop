
import {AccessToken, AccessData, TokenApi, LoginApi} from "authoritarian"
import {AuthStore} from "./stores/auth-store"

export type HandleAccessToken = (accessToken?: AccessToken) => void
export type HandleAccessData = (accessData: AccessData) => void
export type DecodeAccessToken = (accessToken: AccessToken) => AccessData
export type HandleUserLogin = () => void
export type HandleUserLogout = () => void

export interface AuthSlateProps {
	authStore: AuthStore
	handleUserLogin: () => void
	handleUserLogout: () => void
}

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
