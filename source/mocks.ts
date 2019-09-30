
import {
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

const fakeProfileData: Profile = {
	userId: "fake-h31829h381273h",
	public: {
		nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
		picture: "https://picsum.photos/id/375/200/200",
	},
	private: {
		realname: "Captain Branstock Dudley-Faddington",
	}
}

export class MockProfiler implements ProfilerTopic {
	async getPublicProfile({userId}): Promise<Profile> {
		return {
			...fakeProfileData,
			userId,
		}
	}
	async getFullProfile(options): Promise<Profile> {
		return fakeProfileData
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
