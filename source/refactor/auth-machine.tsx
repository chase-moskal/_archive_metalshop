
import {h} from "preact"
import * as preact from "preact"

import {
	AccessToken,
	AuthStoreShape,
	AuthMachineShape,
	TokenDragonShape,
	LoginKangarooShape
} from "./interfaces"

export interface AuthMachineContext {
	authStore: AuthStoreShape
	tokenDragon: TokenDragonShape
	loginKangaroo: LoginKangarooShape
}

export class AuthMachine implements AuthMachineShape {
	private readonly context: AuthMachineContext
	private accessToken: string

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
		const {tokenDragon} = this.context
		try {
			const accessToken = await tokenDragon.getAccessToken()
			this.updateToLoggedIn(accessToken)
		}
		catch (error) {
			this.updateToLoggedOut()
			throw error
		}
	}

	async userPromptLogin(): Promise<void> {
		const {loginKangaroo} = this.context
		try {
			const accessToken = await loginKangaroo.waitForAccessToken()
			this.updateToLoggedIn(accessToken)
		}
		catch (error) {
			this.updateToLoggedOut()
			throw error
		}
		return
	}

	private updateToLoggedIn(accessToken: AccessToken) {
		const {authStore} = this.context
		// TODO verify and read access token
		authStore.setLoggedIn({name: "chase moskal", profilePicture: "pic.jpg"})
	}

	private updateToLoggedOut() {
		const {authStore} = this.context
		authStore.setLoggedOut()
	}
}
