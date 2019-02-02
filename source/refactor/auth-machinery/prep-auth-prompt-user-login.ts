
import {LoginApi} from "../interfaces"

import {AuthUpdateAccessToken} from "./prep-auth-update-access-token"

export const prepAuthPromptUserLogin = (context: {
	loginApi: LoginApi
	authUpdateAccessToken: AuthUpdateAccessToken
}) =>

async function authPassiveCheck() {
	try {
		const accessToken = await context.loginApi.userLoginRoutine()
		context.authUpdateAccessToken(accessToken)
	}
	catch (error) {
		context.authUpdateAccessToken(undefined)
		throw error
	}
}
