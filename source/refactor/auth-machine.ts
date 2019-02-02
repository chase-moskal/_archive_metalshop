
import {
	AccessToken,
	AuthMachineShape,
	AuthMachineContext
} from "./interfaces"

export class AuthMachine implements AuthMachineShape {
	private readonly context: AuthMachineContext
	constructor(context: AuthMachineContext) {
		this.context = context
	}

	/**
	 * Passively check the token api, to get an access token
	 */
	async passiveAuth(): Promise<void> {
		const {tokenApi} = this.context
		try {
			const accessToken = await tokenApi.obtainAccessToken()
			this.updateAccessToken(accessToken)
		}
		catch (error) {
			this.updateAccessToken(undefined)
			throw error
		}
	}

	/**
	 * Prompt the user with a login routine, to get an access token
	 */
	async promptUserLogin(): Promise<void> {
		const {loginApi} = this.context
		try {
			const accessToken = await loginApi.userLoginRoutine()
			this.updateAccessToken(accessToken)
		}
		catch (error) {
			this.updateAccessToken(undefined)
			throw error
		}
		return
	}

	/**
	 * Log the user out
	 */
	async logout(): Promise<void> {
		const {tokenApi} = this.context
		await tokenApi.clearTokens()
		this.updateAccessToken(undefined)
	}

	// decode user profile from the token and set on the panel store
	private updateAccessToken(accessToken: AccessToken | undefined) {
		const {verifyAndReadAccessToken, updateUserProfile} = this.context
		if (accessToken) {
			const userProfile = verifyAndReadAccessToken(accessToken)
			updateUserProfile(userProfile)
		}
		else {
			updateUserProfile(undefined)
		}
	}
}
