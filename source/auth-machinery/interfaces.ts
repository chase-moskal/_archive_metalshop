
import {AuthPanelStore} from "source/stores/auth-panel-store"

/////////////////////////
////// AUTH SERVER //////
/////////////////////////

/** Auth server json api */
export interface AuthApi {

	/** Trade a refresh token for an access token */
	authorize(options: {refreshToken: RefreshToken}): Promise<AccessToken>

	/** Trade a google token for auth tokens (after the google oauth flow) */
	authenticateWithGoogle(options: {googleToken: string}): Promise<AuthTokens>
}

/** Token crosscall iframe api */
export interface TokenApi {

	/** Check local storage and/or call authorize to obtain an access token */
	obtainAccessToken(): Promise<AccessToken>

	/** Clear all local tokens as a part of a logout routine */
	clearTokens(): Promise<void>
}

/** Login crosscall popup api */
export interface LoginApi {

	/** Initiate the google login routine in a popup, return an access token */
	userLoginRoutine(): Promise<AccessToken>
}

/////////////////////////////////////
////// AUTH MACHINERY (CLIENT) //////
/////////////////////////////////////

/** Authorization token contains encoded access data */
export type AccessToken = string

/** Authentication token used to fetch new access tokens */
export type RefreshToken = string

/** Access data which is encoded within an access token */
export interface AccessData {
	name: string
	profilePicture: string
}

/** Both auth token types from a successful login routine */
export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}

/** Handle the reception of an access token */
export type HandleAccessToken = (accessToken?: AccessToken) => void

/** Handle the reception of decoded access data */
export type HandleAccessData = (accessData: AccessData) => void

/** Decode access data out of an access token */
export type DecodeAccessToken = (accessToken: AccessToken) => AccessData
