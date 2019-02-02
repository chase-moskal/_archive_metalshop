
import {AuthPanelStore} from "./components/auth-panel"

import {
	TokenApi,
	LoginApi,
	AccessToken,
	UserProfile,
	AuthMachineShape
} from "./interfaces"

export interface AuthMachineContext {
	panelStore: AuthPanelStore
	tokenApi: TokenApi
	loginApi: LoginApi
	verifyAndReadAccessToken: (accessToken: AccessToken) => UserProfile
}

export class AuthMachine implements AuthMachineShape {
	private readonly context: AuthMachineContext
	get panelStore() { return this.context.panelStore }

	constructor(context: AuthMachineContext) {
		this.context = context
	}

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

	async userPromptLogin(): Promise<void> {
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

	async logout(): Promise<void> {
		const {tokenApi} = this.context

		await tokenApi.clearTokens()
		this.updateAccessToken(undefined)
	}

	private updateAccessToken(accessToken: AccessToken | undefined) {
		const {panelStore, verifyAndReadAccessToken} = this.context

		if (accessToken) {
			const userProfile = verifyAndReadAccessToken(accessToken)
			panelStore.setUserProfile(userProfile)
		}
		else {
			panelStore.setUserProfile(undefined)
		}
	}
}
