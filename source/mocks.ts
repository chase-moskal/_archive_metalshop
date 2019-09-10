
import {
	AuthTokens,
	AccountPopupTopic,
	TokenStorageTopic,
} from "authoritarian"

export class MockAccountPopup implements AccountPopupTopic {
	async login() {
		return "a123"
	}
}

export class MockTokenStorage implements TokenStorageTopic {
	async passiveCheck() {
		return "a123"
	}
	async writeTokens(tokens: AuthTokens) {}
	async clearTokens() {}
}
