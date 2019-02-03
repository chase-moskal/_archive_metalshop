
import {TokenApi, HandleAccessToken} from "./interfaces"

export const prepPassiveCheck = (context: {
	tokenApi: TokenApi
	handleAccessToken: HandleAccessToken
}) =>

async function passiveCheck() {
	try {
		const accessToken = await context.tokenApi.obtainAccessToken()
		context.handleAccessToken(accessToken)
	}
	catch (error) {
		context.handleAccessToken(undefined)
		throw error
	}
}
