
import {tokenSign} from "redcrypto/dist/token-sign.js"
import {AccessPayload, RefreshPayload} from "authoritarian/dist/interfaces.js"

import {privateKey} from "./mock-keys.js"

const year = 1000 * 60 * 60 * 24 * 365

export async function createMockAccessToken({
	claims = {},
	expiresMilliseconds = year * 10000
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
	expiresMilliseconds = year * 11000
}: {
	expiresMilliseconds?: number
} = {}) {
	return tokenSign<RefreshPayload>({
		payload: {userId: "u123"},
		expiresMilliseconds,
		privateKey
	})
}
