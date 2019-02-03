
import {TokenApi, HandleAccessToken} from "./interfaces"

export const prepLogout = (context: {
	tokenApi: TokenApi
	authHandleAccessToken: HandleAccessToken
}) =>

async function logout() {
	await context.tokenApi.clearTokens()
	context.authHandleAccessToken(undefined)
}
