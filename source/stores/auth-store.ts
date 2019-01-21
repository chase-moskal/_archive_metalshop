
import {observable, action, computed} from "mobx"

import {AuthTokens} from "./interfaces"

export class AuthStore {
	@observable open: boolean = false
	@observable tokens: AuthTokens

	@computed get loggedIn() {
		return !!this.tokens && !!this.tokens.nToken && !!this.tokens.zToken
	}

	@action toggleOpen(value?: boolean) {
		if (value === undefined) {
			this.open = !this.open
		}
		else {
			this.open = value
		}
	}

	@action setTokens(tokens: AuthTokens) {
		this.tokens = tokens
	}
}
