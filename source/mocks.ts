
import {
	User,
	Profile,
	AuthTokens,
	AccessToken,
	ProfilerTopic,
	AccountPopupTopic,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"

// import {Profile, PaywallGuardianTopic, ProfileManagerTopic} from "./interfaces.js"

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

export class MockProfileManager implements ProfilerTopic {
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
