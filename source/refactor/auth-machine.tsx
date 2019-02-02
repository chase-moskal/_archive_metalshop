
import {h} from "preact"
import * as preact from "preact"

import {AuthPanelStore} from "./components/auth-panel"

import {
	AccessToken,
	AuthMachineShape,
	TokenApi,
	LoginApi,
	UserProfile
} from "./interfaces"

export interface AuthMachineContext {
	panelStore: AuthPanelStore
	tokenApi: TokenApi
	loginApi: LoginApi
}

export class AuthMachine implements AuthMachineShape {
	private readonly context: AuthMachineContext

	constructor(context: AuthMachineContext) {
		this.context = context
	}

	renderPanel(element: Element): Element {
		const newElement = preact.render(
			<div/>,
			null,
			element
		)
		return newElement
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

	private updateAccessToken(accessToken: AccessToken | undefined) {
		const {panelStore} = this.context
		if (accessToken) {
			const userProfile = this.verifyAndReadAccessToken(accessToken)
			panelStore.setUserProfile(userProfile)
		}
		else {
			panelStore.setUserProfile(undefined)
		}
	}

	private verifyAndReadAccessToken(accessToken: AccessToken): UserProfile {
		// TODO
		return {
			name: "Chase Moskal",
			profilePicture: "chase.jpg"
		}
	}
}
