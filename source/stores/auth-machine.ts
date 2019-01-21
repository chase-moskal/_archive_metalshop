
import {observable, action} from "mobx"

// export interface GoogleAuthOptions {
// 	clientId: string
// }

export interface AuthMachineOptions {
	googleAuth: gapi.auth2.GoogleAuth
}

export class AuthMachine {
	private googleAuth: gapi.auth2.GoogleAuth

	@observable nToken: string
	@observable zToken: string

	@action setNToken(nToken: string) {
		this.nToken = nToken
	}

	@action setZToken(zToken: string) {
		this.zToken = zToken
	}

	constructor(options: AuthMachineOptions) {
		this.googleAuth = options.googleAuth
	}

	async authenticate() {
		this.googleAuth.signIn({
			
		})
	}

	async authorize() {}
}
