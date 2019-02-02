import { AuthSlateStore } from "./components/auth-slate";

/////////// AUTH-SERVER ////////////
///////////////////////////////////

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
}

// login crosscall popup api
export interface LoginApi {
	userLoginRoutine(): Promise<AccessToken>
		// go through whole login routine
		// save both tokens
		// return the access token
}

/////////// AUTHORITARIAN-CLIENT ////////////
////////////////////////////////////////////

export interface AuthMachineShape {
	renderPanel(element: Element): void
		// render the ui components into the dom
	passiveAuth(): Promise<void>
		// crosscalls tokenApi.obtainAccessToken()
		// stores access token in authstore
	userPromptLogin(): Promise<void>
		// crosscalls loginApi.userLoginRoutine()
		// stores access token in authstore
}

////////////////////////////

export type AccessToken = string
export type RefreshToken = string
export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}

// export interface AuthPanelStoreShape {
// 	open: boolean
// 	loggedIn: boolean
// 	userProfile: UserProfile
// 	toggleOpen(value?: boolean): boolean
// 	setLoggedIn(userProfile: UserProfile): void
// 	setLoggedOut(): void
// }

export interface UserProfile {
	name: string
	profilePicture: string
}
