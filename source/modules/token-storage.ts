
import {TokenStorageOptions, AuthTokens} from "./interfaces"

import {consoleCurry} from "./console-curry"
const debug = consoleCurry({
	consoleFunction: console.debug,
	tag: "token-storage"
})

/**
 * Communicate with the auth-server's token storage mechanism,
 * to load or save auth tokens
 */
export default class TokenStorage {
	private readonly authServerOrigin: string

	constructor(options: TokenStorageOptions) {
		this.authServerOrigin = options.authServerOrigin
		debug(`intialize for "${this.authServerOrigin}"`)
	}

	async load(): Promise<AuthTokens> {
		// TODO
		// const tokens: AuthTokens = {nToken: "n123", zToken: "z123"}
		const tokens: AuthTokens = {nToken: undefined, zToken: undefined}
		debug("load", tokens)
		return tokens
	}

	async save(tokens: AuthTokens): Promise<void> {
		// TODO
		debug("save", tokens)
		return
	}
}
