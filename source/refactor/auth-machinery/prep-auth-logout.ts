
import {TokenApi} from "./interfaces"

import {AuthHandleAccessToken} from "./prep-auth-handle-access-token"

export const prepAuthLogout = (context: {
	tokenApi: TokenApi
	authHandleAccessToken: AuthHandleAccessToken
}) =>

async function authLogout() {
	await context.tokenApi.clearTokens()
	context.authHandleAccessToken(undefined)
}
