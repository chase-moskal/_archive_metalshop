
import {AuthStore} from "./auth-store"
import {AuthMachineOptions} from "./interfaces"

export class AuthMachine {
	readonly authStore: AuthStore
	private readonly authServerUrl: string

	constructor({authServerUrl, authStore = new AuthStore()}: AuthMachineOptions) {
		this.authStore = authStore
		this.authServerUrl = authServerUrl
	}

	async login() {
		console.log(`mock interaction with "${this.authServerUrl}"`)
		this.authStore.setTokens({nToken: "a123", zToken: "b234"})
	}
}
