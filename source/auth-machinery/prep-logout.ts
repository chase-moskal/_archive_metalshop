
import {TokenApi, HandleAccessToken} from "./interfaces"

export const prepLogout = (context: {
	tokenApi: TokenApi
	handleAccessToken: HandleAccessToken
}) =>

async function logout() {
	await context.tokenApi.clearTokens()
	context.handleAccessToken(undefined)
}
