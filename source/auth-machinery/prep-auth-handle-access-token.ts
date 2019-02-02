
import {
	AccessToken,
	HandleAccessData,
	DecodeAccessToken,
	AuthHandleAccessToken
} from "./interfaces"

export const prepAuthHandleAccessToken = (context: {
	handleAccessData: HandleAccessData
	decodeAccessToken: DecodeAccessToken
}): {authHandleAccessToken: AuthHandleAccessToken} => ({

	authHandleAccessToken(accessToken?: AccessToken) {
		if (accessToken) {
			const userProfile = context.decodeAccessToken(accessToken)
			context.handleAccessData(userProfile)
		}
		else {
			context.handleAccessData(undefined)
		}
	}
})

