
import {
	User,
	AuthTokens,
	AccessToken,
	AccountPopupTopic,
	TokenStorageTopic,
} from "authoritarian/dist/interfaces.js"

import {Profile, PaywallGuardianTopic, ProfileManagerTopic} from "./interfaces.js"

export class MockAccountPopup implements AccountPopupTopic {
	async login() {
		return {accessToken: "a123", refreshToken: "r123"}
	}
}

export class MockTokenStorage implements TokenStorageTopic {
	async passiveCheck() {
		return "a123"
	}
	async writeTokens(tokens: AuthTokens) {}
	async clearTokens() {}
}

export class MockProfileManager implements ProfileManagerTopic {
	async getProfile(options: {accessToken: AccessToken}): Promise<Profile> {
		return {
			nickname: "Chase",
			realname: "Chase Moskal",
			picture: "https://picsum.photos/id/375/200/200",
		}
	}
	async setProfile(options: {accessToken: AccessToken, profile: Profile}): Promise<void> {
		return undefined
	}
}

export class MockPaywallGuardian implements PaywallGuardianTopic {
	async makeUserPremium(options: {accessToken: AccessToken}) {
		return "a123"
	}
	async revokeUserPremium(options: {accessToken: AccessToken}) {
		return "a123"
	}
}

export function mockDecodeToken({token}: {token: AccessToken}): User {
	return {
		userId: 1,
		claims: {
			supercool: true
		}
	}
}
