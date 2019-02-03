
import {LoginApi, HandleAccessToken} from "./interfaces"

export const prepPromptUserLogin = (context: {
	loginApi: LoginApi
	handleAccessToken: HandleAccessToken
}) =>

async function promptUserLogin() {
	try {
		const accessToken = await context.loginApi.userLoginRoutine()
		context.handleAccessToken(accessToken)
	}
	catch (error) {
		context.handleAccessToken(undefined)
		throw error
	}
}
