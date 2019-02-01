
/////////// AUTH-SERVER ////////////
///////////////////////////////////

// auth renraku api
export interface UserAuthShape {
	authorize(options: {refreshToken: RefreshToken}): Promise<AccessToken>
	authenticateWithGoogle(options: {googleToken: string}): Promise<AuthTokens>
}

// token crosscall iframe api
export interface TokenDragonShape {
	getAccessToken(): Promise<AccessToken>
		// checks local storage and/or calls authorize
		// saves and returns the access token
}

// login crosscall popup api
export interface LoginKangarooShape {
	waitForAccessToken(): Promise<AccessToken>
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
		// crosscalls tokenDragonMethods.getAccessToken()
		// stores access token in authstore
	userPromptLogin(): Promise<void>
		// crosscalls loginKangarooMethods.waitForAccessToken()
		// stores access token in authstore
}

////////////////////////////

export type AccessToken = string
export type RefreshToken = string
export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}

export interface AuthStoreShape extends AuthProfile {
	open: boolean
	loggedIn: boolean
	toggleOpen(value?: boolean): void
	setLoggedIn(state: AuthProfile): void
	setLoggedOut(): void
}

export interface AuthProfile {
	name: string
	profilePicture: string
}
