
import {
	AccessToken,
	HandleAccessData,
	DecodeAccessToken,
	HandleAccessToken
} from "./interfaces"

export const prepHandleAccessToken = (context: {
	handleAccessData: HandleAccessData
	decodeAccessToken: DecodeAccessToken
}): HandleAccessToken =>

function handleAccessToken(accessToken?: AccessToken) {
	if (accessToken) {
		const userProfile = context.decodeAccessToken(accessToken)
		context.handleAccessData(userProfile)
	}
	else {
		context.handleAccessData(undefined)
	}
}
