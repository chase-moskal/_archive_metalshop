
import {AccessToken, AccessData, TokenApi, LoginApi} from "authoritarian"

export interface AuthStore {
	readonly loggedIn: boolean
	readonly profilePicture: string
}

export type HandleAccessToken = (accessToken?: AccessToken) => void
export type HandleAccessData = (accessData: AccessData) => void
export type DecodeAccessToken = (accessToken: AccessToken) => AccessData
export type HandleUserLogin = () => void
export type HandleUserLogout = () => void

export interface AuthSlateProps {
	handleUserLogin: () => void
	handleUserLogout: () => void
}

export interface AuthMachineFundamentals {
	tokenApi: TokenApi
	loginApi: LoginApi
	onStoreUpdate: () => void
	decodeAccessToken: DecodeAccessToken
}

export interface RenderAuthSlateOptions extends AuthSlateProps {
	element: Element
}

export interface AuthController {
	store: AuthStore
	logout: () => Promise<void>
	passiveCheck: () => Promise<void>
	promptUserLogin: () => Promise<void>
}
