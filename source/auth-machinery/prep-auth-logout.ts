
import {TokenApi, AuthHandleAccessToken} from "./interfaces"

export const prepAuthLogout = (context: {
	tokenApi: TokenApi
	authHandleAccessToken: AuthHandleAccessToken
}) =>

async function authLogout() {
	await context.tokenApi.clearTokens()
	context.authHandleAccessToken(undefined)
}
