
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
		const accessData = context.decodeAccessToken(accessToken)
		context.handleAccessData(accessData)
	}
	else {
		context.handleAccessData(undefined)
	}
}
