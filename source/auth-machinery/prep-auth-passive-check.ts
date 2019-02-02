
import {TokenApi} from "./interfaces"

import {AuthHandleAccessToken} from "./prep-auth-handle-access-token"

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
