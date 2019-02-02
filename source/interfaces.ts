
/////////// AUTHORITARIAN-CLIENT ////////////
////////////////////////////////////////////

export interface AuthMachineShape {
	passiveAuth(): Promise<void> // tokenApi.obtainAccessToken()
	logout(): Promise<void> // tokenApi.clearTokens()
	promptUserLogin(): Promise<void> // loginApi.userLoginRoutine()
}

////////////////////////////

export type AccessToken = string
export type RefreshToken = string

export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}

export interface AccessData {
	name: string
	profilePicture: string
}

export type HandleAccessData = (accessData: AccessData) => void
export type DecodeAccessToken = (accessToken: AccessToken) => AccessData
