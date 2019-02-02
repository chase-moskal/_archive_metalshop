
import {
	AccessToken,
	HandleAccessData,
	DecodeAccessToken
} from "../interfaces"

export type AuthHandleAccessToken = (accessToken?: AccessToken) => void

export const prepAuthHandleAccessToken = (context: {
	handleAccessData: HandleAccessData
	decodeAccessToken: DecodeAccessToken
}): AuthHandleAccessToken =>

function authHandleAccessToken(accessToken?: AccessToken) {
	if (accessToken) {
		const userProfile = context.decodeAccessToken(accessToken)
		context.handleAccessData(userProfile)
	}
	else {
		context.handleAccessData(undefined)
	}
}
