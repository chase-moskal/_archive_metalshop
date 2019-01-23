
import ApiCommunicator from "./api-communicator"
import TokenStorage from "./token-storage"
import {AuthMachineOptions, ZToken, AuthTokens} from "./interfaces"

import AuthStore from "../stores/auth-store"

export default class AuthMachine {
	readonly authStore: AuthStore
	private readonly apiCommunicator: ApiCommunicator
	private readonly tokenStorage: TokenStorage

	constructor({authStore, tokenStorage, apiCommunicator}: AuthMachineOptions) {
		this.authStore = authStore
		this.apiCommunicator = apiCommunicator
		this.tokenStorage = tokenStorage
	}

	/**
	 * Authenticate and authorize the current user
	 */
	async auth(): Promise<ZToken> {
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
		return "z123"
	}

	private async promptLoginRoutine(): Promise<AuthTokens> {
		// TODO
		return {nToken: "n123", zToken: "z123"}
	}
}
