
import {
	Profile,
	AuthTokens,
	AccessToken,
	ProfilerTopic,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"
import {AccountPopupLogin, AuthContext} from "./interfaces.js"

const nap = (multiplier: number = 1) =>
	new Promise(resolve => setTimeout(resolve, multiplier * 500))

export const mockAccountPopupLogin: AccountPopupLogin = async() => {
	await nap()
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
		await nap()
		return "a123"
	}
	async writeTokens(tokens: AuthTokens) {
		await nap()
	}
	async clearTokens() {
		await nap()
	}
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
		await nap()
		return {
			...fakeProfileData,
			userId,
		}
	}
	async getFullProfile(options): Promise<Profile> {
		await nap()
		return fakeProfileData
	}
	async setFullProfile(options): Promise<void> {
		await nap()
		return undefined
	}
}

export class MockPaywallGuardian implements PaywallGuardianTopic {
	async makeUserPremium(options: {accessToken: AccessToken}) {
		await nap()
		return "a123"
	}
	async revokeUserPremium(options: {accessToken: AccessToken}) {
		await nap()
		return "a123"
	}
}
