
import {LoginApi} from "./interfaces"

import {AuthHandleAccessToken} from "./prep-auth-handle-access-token"

export const prepAuthPromptUserLogin = (context: {
	loginApi: LoginApi
	authHandleAccessToken: AuthHandleAccessToken
}) =>

async function authPassiveCheck() {
	try {
		const accessToken = await context.loginApi.userLoginRoutine()
		context.authHandleAccessToken(accessToken)
	}
	catch (error) {
		context.authHandleAccessToken(undefined)
		throw error
	}
}
