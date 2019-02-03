
import {LoginApi, AuthHandleAccessToken} from "./interfaces"

export const prepAuthPromptUserLogin = (context: {
	loginApi: LoginApi
	authHandleAccessToken: AuthHandleAccessToken
}) =>

async function authPromptUserLogin() {
	try {
		const accessToken = await context.loginApi.userLoginRoutine()
		context.authHandleAccessToken(accessToken)
	}
	catch (error) {
		context.authHandleAccessToken(undefined)
		throw error
	}
}
