
import {observable, action, computed} from "mobx"

export interface AuthMachineOptions {
	authServerUrl: string
}

export interface AuthTokens {
	nToken: string
	zToken: string
}

export class AuthMachine {
	private readonly authServerUrl: string
	@observable nToken: string // refresh token (authN)
	@observable zToken: string // access token (authZ)

	@computed get loggedIn() {
		return !!this.nToken && !!this.zToken
	}

	constructor({authServerUrl}: AuthMachineOptions) {
		this.authServerUrl = authServerUrl
	}

	@action setTokens({nToken, zToken}: AuthTokens) {
		this.nToken = nToken
		this.zToken = zToken
	}

	@action login() {
		setTimeout(
			() => {
				console.log(`mock interaction with "${this.authServerUrl}"`)
				this.setTokens({nToken: "a123", zToken: "b234"})
			},
			100
		)
	}
}
