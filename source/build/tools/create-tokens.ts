
import {tokenSign} from "redcrypto/dist/token-sign.js"
import {AccessPayload, RefreshPayload} from "authoritarian/dist/interfaces.js"

import {privateKey} from "./mock-keys.js"

export async function createMockAccessToken({
	claims = {},
	expiresMilliseconds = 20 * (1000 * 60),
}: {
	claims: {}
	expiresMilliseconds?: number
} = {claims: {}}) {
	return tokenSign<AccessPayload>({
		expiresMilliseconds,
		privateKey,
		payload: {
			user: {
				userId: "u123",
				claims,
			}
		}
	})
}

export async function createMockRefreshToken({
	expiresMilliseconds = 60 * (1000 * 60 * 60 * 24)
}: {
	expiresMilliseconds?: number
} = {}) {
	return tokenSign<RefreshPayload>({
		payload: {userId: "u123"},
		expiresMilliseconds,
		privateKey
	})
}
