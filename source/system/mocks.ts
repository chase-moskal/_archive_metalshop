
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
import {AuthContext, LoginPopupRoutine, RestrictedLivestream, Livestream} from "./interfaces.js"

const debug = (message: string) => console.debug(`mock: ${message}`)

const nap = (multiplier: number = 1) =>
	new Promise(resolve => setTimeout(resolve, multiplier * 250))

async function createMockAccessToken({
	claims = {cool: true},
	expiresIn = "20m"
}: {
	claims?: Object
	expiresIn?: string
} = {}) {
	debug("createMockAccessToken")
	return signToken<AccessPayload>({
		payload: {user: {userId: "u123", claims}},
		expiresIn,
		privateKey
	})
}

async function createMockRefreshToken({expiresIn = "60d"}: {
	expiresIn?: string
} = {}) {
	debug("createMockRefreshToken")
	return signToken<RefreshPayload>({
		payload: {userId: "u123"},
		expiresIn,
		privateKey
	})
}

const mockRefreshToken = createMockRefreshToken()
const mockAccessToken = createMockAccessToken({claims: {premium: false}})
const mockPremiumAccessToken = createMockAccessToken({claims: {premium: true}})
const mockAdminAccessToken = createMockAccessToken({claims: {admin: true, premium: true}})

export const mockLoginPopupRoutine: LoginPopupRoutine = async() => {
	debug("mockLoginPopupRoutine")
	await nap()
	return {
		accessToken: await mockAccessToken,
		refreshToken: await mockRefreshToken
	}
}

export const mockDecodeAccessToken = (accessToken: AccessToken):
 AuthContext => {
	debug("mockDecodeAccessToken")
	return ({
		exp: (Date.now() / 1000) + 10,
		user: {userId: "u123", claims: {premium: true}},
		accessToken
	})
}

export class MockRestrictedLivestream implements RestrictedLivestream {
	private _livestream: Livestream = {
		embed: "livestream-data-lol"
	}
	async getLivestream(options: {accessToken: AccessToken}) {
		return this._livestream
	}
	async updateLivestream(options: {
		accessToken: AccessToken
		livestream: Livestream
	}) {
		this._livestream = options.livestream
	}
}

export class MockTokenStorage implements TokenStorageTopic {
	private _mockAdmin: boolean
	constructor({mockAdmin}: {mockAdmin: boolean}) {
		this._mockAdmin = mockAdmin
	}

	async passiveCheck() {
		debug("passiveCheck")
		await nap()
		return this._mockAdmin ? mockAdminAccessToken : mockAccessToken
	}
	async writeTokens(tokens: AuthTokens) {
		debug("writeTokens")
		await nap()
	}
	async writeAccessToken(accessToken: AccessToken) {
		debug("writeAccessToken")
		await nap()
	}
	async clearTokens() {
		debug("clearTokens")
		await nap()
	}
}

export class MockProfiler implements ProfilerTopic {
	private _profile: Profile = {
		userId: "fake-h31829h381273h",
		public: {
			nickname: "ℒord ℬrimshaw Đuke-Ŵellington",
			picture: "https://picsum.photos/id/375/200/200",
		},
		private: {
			realname: "Captain Branstock Dudley-Faddington",
		}
	}
	async getPublicProfile({userId}): Promise<Profile> {
		debug("getPublicProfile")
		await nap()
		return {
			...this._profile,
			userId,
		}
	}
	async getFullProfile(options): Promise<Profile> {
		debug("getFullProfile")
		await nap()
		return this._profile
	}
	async setFullProfile({profile}): Promise<void> {
		debug("setFullProfile")
		await nap()
		this._profile = profile
		return undefined
	}
}

export class MockPaywallGuardian implements PaywallGuardianTopic {
	async makeUserPremium(options: {accessToken: AccessToken}) {
		debug("makeUserPremium")
		await nap()
		return mockPremiumAccessToken
	}
	async revokeUserPremium(options: {accessToken: AccessToken}) {
		debug("revokeUserPremium")
		await nap()
		return mockAccessToken
	}
}
