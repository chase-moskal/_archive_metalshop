
import {
	User,
	Profile,
	AuthTokens,
	AccessToken,
	ProfilerTopic,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"
import {AccountPopupLogin, AuthContext} from "./interfaces.js"

export const mockAccountPopupLogin: AccountPopupLogin = async() => {
	return {accessToken: "a123", refreshToken: "r123"}
}

export const mockDecodeAccessToken = (accessToken: AccessToken):
	AuthContext => ({
		exp: (Date.now() / 1000) + 10,
		user: {userId: "u123", claims: {premium: true}},
		accessToken
	})

export class MockTokenStorage implements TokenStorageTopic {
	async passiveCheck() {
		return "a123"
	}
	async writeTokens(tokens: AuthTokens) {}
	async clearTokens() {}
}

export class MockProfiler implements ProfilerTopic {
	async getPublicProfile({userId}): Promise<Profile> {
		return {
			userId,
			public: {
				nickname: "fake chase",
				picture: "https://picsum.photos/id/375/200/200",
			},
			private: {
				realname: "Fake Chase Moskal",
			}
		}
	}
	async getFullProfile(options): Promise<Profile> {
		return {
			userId: "lol48729i318920u3",
			public: {
				nickname: "fake chase",
				picture: "https://picsum.photos/id/375/200/200",
			},
			private: {
				realname: "Fake Chase Moskal",
			}
		}
	}
	async setFullProfile(options): Promise<void> {
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
