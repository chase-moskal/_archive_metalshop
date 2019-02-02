
import {RefreshToken, AccessToken, AuthTokens} from "../interfaces"

// auth renraku api
export interface AuthApi {
	authorize(options: {refreshToken: RefreshToken}): Promise<AccessToken>
	authenticateWithGoogle(options: {googleToken: string}): Promise<AuthTokens>
}

// token crosscall iframe api
export interface TokenApi {
	obtainAccessToken(): Promise<AccessToken>
		// checks local storage and/or calls authorize
		// saves and returns the access token
	clearTokens(): Promise<void>
		// clear all local tokens as a part of a logout routine
}

// login crosscall popup api
export interface LoginApi {
	userLoginRoutine(): Promise<AccessToken>
		// go through whole login routine
		// save both tokens
		// return the access token
}
