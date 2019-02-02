
import {TokenApi, AuthHandleAccessToken} from "./interfaces"

export const prepAuthLogout = (context: {
	tokenApi: TokenApi
	authHandleAccessToken: AuthHandleAccessToken
}) => ({

	async authLogout() {
		await context.tokenApi.clearTokens()
		context.authHandleAccessToken(undefined)
	}
})
