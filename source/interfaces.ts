
/////////// AUTHORITARIAN-CLIENT ////////////
////////////////////////////////////////////

export interface AuthMachineShape {
	passiveAuth(): Promise<void> // tokenApi.obtainAccessToken()
	logout(): Promise<void> // tokenApi.clearTokens()
	promptUserLogin(): Promise<void> // loginApi.userLoginRoutine()
}

////////////////////////////
