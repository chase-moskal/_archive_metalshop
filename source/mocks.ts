
import {
	Profile,
	AuthTokens,
	AccessToken,
	ProfilerTopic,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"
import {AccountPopupLogin, AuthContext} from "./interfaces.js"

const nap = (duration: number) =>
	new Promise(resolve => setTimeout(resolve, duration))

export const mockAccountPopupLogin: AccountPopupLogin = async() => {
	await nap(1000)
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
		await nap(1000)
		return "a123"
	}
	async writeTokens(tokens: AuthTokens) {
		await nap(1000)
	}
	async clearTokens() {
		await nap(1000)
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
		await nap(1000)
		return {
			...fakeProfileData,
			userId,
		}
	}
	async getFullProfile(options): Promise<Profile> {
		await nap(1000)
		return fakeProfileData
	}
	async setFullProfile(options): Promise<void> {
		await nap(1000)
		return undefined
	}
}

export class MockPaywallGuardian implements PaywallGuardianTopic {
	async makeUserPremium(options: {accessToken: AccessToken}) {
		await nap(1000)
		return "a123"
	}
	async revokeUserPremium(options: {accessToken: AccessToken}) {
		await nap(1000)
		return "a123"
	}
}
