
import TokenStorage from "./token-storage"
import ApiCommunicator from "./api-communicator"
import promptLoginRoutine from "./prompt-login-routine"
import {
	ZToken,
	AuthTokens,
	AuthMachineOptions
} from "./interfaces"

import AuthStore from "../stores/auth-store"

import {consoleCurry} from "./console-curry"
const debug = consoleCurry({
	consoleFunction: console.debug,
	tag: "auth-machine"
})

export default class AuthMachine {
	readonly authStore: AuthStore
	private readonly authServerOrigin: string
	private readonly tokenStorage: TokenStorage
	private readonly apiCommunicator: ApiCommunicator

	constructor(options: AuthMachineOptions) {
		this.authStore = options.authStore
		this.tokenStorage = options.tokenStorage
		this.apiCommunicator = options.apiCommunicator
		this.authServerOrigin = options.authServerOrigin
		debug("constructed with options", options)
	}

	/**
	 * Authenticate and authorize the current user
	 */
	async auth(): Promise<ZToken> {
		debug("auth routine initiated")
		let {nToken, zToken} = await this.tokenStorage.load()

		if (nToken) {
			if (zToken) return zToken
			else {
				zToken = await this.fetchZToken()
				this.tokenStorage.save({nToken, zToken})
				return zToken
			}
		}

		else {
			const tokens = await this.promptLoginRoutine()
			this.tokenStorage.save(tokens)
			return tokens.zToken
		}
	}

	private async fetchZToken(): Promise<ZToken> {
		// TODO
		debug("fetch z token")
		return "z123"
	}

	private async promptLoginRoutine(): Promise<AuthTokens> {
		// TODO
		debug("login popup time")
		const {authServerOrigin} = this
		return promptLoginRoutine({authServerOrigin})
	}
}
