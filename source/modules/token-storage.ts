
import {TokenStorageOptions, AuthTokens} from "./interfaces"

/**
 * Communicate with the auth-server's token storage mechanism,
 * to load or save auth tokens
 */
export default class TokenStorage {
	private readonly authServerUrl: string

	constructor(options: TokenStorageOptions) {
		this.authServerUrl = options.authServerUrl
	}

	async load(): Promise<AuthTokens> {
		// TODO
		return {nToken: "n123", zToken: "z123"}
	}

	async save(tokens: AuthTokens): Promise<void> {
		// TODO
		return
	}
}
