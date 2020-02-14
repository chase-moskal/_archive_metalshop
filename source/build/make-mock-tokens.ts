#!/usr/bin/env node

import {createMockRefreshToken, createMockAccessToken}
	from "./tools/create-tokens.js"

import {prepareWriteToken} from "./tools/write-token.js"

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
