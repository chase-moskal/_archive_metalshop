
import {TokenApi} from "../interfaces"

import {AuthUpdateAccessToken} from "./prep-auth-update-access-token"

export const prepAuthPassiveCheck = (context: {
	tokenApi: TokenApi
	authUpdateAccessToken: AuthUpdateAccessToken
}) =>

async function authPassiveCheck() {
	try {
		const accessToken = await context.tokenApi.obtainAccessToken()
		context.authUpdateAccessToken(accessToken)
	}
	catch (error) {
		context.authUpdateAccessToken(undefined)
		throw error
	}
}
