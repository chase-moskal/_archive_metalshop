
import {
	Profile,
	AuthTokens,
	AccessToken,
	AccessPayload,
	ProfilerTopic,
	RefreshPayload,
	TokenStorageTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist/interfaces.js"
import {signToken} from "authoritarian/dist/crypto.js"

import {privateKey} from "./mock-keys.js"
import {AuthContext, LoginPopupRoutine} from "./interfaces.js"

const nap = (multiplier: number = 1) =>
	new Promise(resolve => setTimeout(resolve, multiplier * 250))

async function createMockAccessToken({
	claims = {cool: true},
	expiresIn = "20m"
}: {
	claims?: Object
	expiresIn?: string
} = {}) {
	return signToken<AccessPayload>({
		payload: {user: {userId: "u123", claims}},
		expiresIn,
		privateKey
	})
}

async function createMockRefreshToken({expiresIn = "60d"}: {
	expiresIn?: string
} = {}) {
	return signToken<RefreshPayload>({
		payload: {userId: "u123"},
		expiresIn,
		privateKey
	})
}

const mockRefreshToken = createMockRefreshToken()
const mockAccessToken = createMockAccessToken({claims: {premium: false}})
const mockPremiumAccessToken = createMockAccessToken({claims: {premium: true}})

export const mockLoginPopupRoutine: LoginPopupRoutine = async() => {
	await nap()
	return {
		accessToken: await mockAccessToken,
		refreshToken: await mockRefreshToken
	}
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
		return mockAccessToken
	}
	async writeTokens(tokens: AuthTokens) {
		await nap()
	}
	async writeAccessToken(accessToken: AccessToken) {
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
		return mockPremiumAccessToken
	}
	async revokeUserPremium(options: {accessToken: AccessToken}) {
		await nap()
		return mockAccessToken
	}
}
