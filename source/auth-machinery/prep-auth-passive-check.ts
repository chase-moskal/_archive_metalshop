
import {TokenApi, AuthHandleAccessToken} from "./interfaces"

export const prepAuthPassiveCheck = (context: {
	tokenApi: TokenApi
	authHandleAccessToken: AuthHandleAccessToken
}) =>

async function authPassiveCheck() {
	try {
		const accessToken = await context.tokenApi.obtainAccessToken()
		context.authHandleAccessToken(accessToken)
	}
	catch (error) {
		context.authHandleAccessToken(undefined)
		throw error
	}
}
