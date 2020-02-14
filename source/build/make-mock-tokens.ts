#!/usr/bin/env node

import {createMockRefreshToken, createMockAccessToken}
	from "./more/create-tokens.js"

import {prepareWriteToken} from "./more/write-token.js"

~async function() {
	const writeToken = prepareWriteToken("./dist")

	await writeToken("mock-refresh.token", await createMockRefreshToken())

	await writeToken("mock-access.token", await createMockAccessToken({
		claims: {premium: false}
	}))

	await writeToken("mock-access-premium.token", await createMockAccessToken({
		claims: {premium: true}
	}))

	await writeToken("mock-access-admin.token", await createMockAccessToken({
		claims: {admin: true, premium: true}
	}))
}()
