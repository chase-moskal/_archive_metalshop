
import {
	AccessToken,
	UpdateUserProfile,
	VerifyAndReadAccessToken
} from "../interfaces"

export type AuthUpdateAccessToken = (accessToken?: AccessToken) => void

export const prepAuthUpdateAccessToken = (context: {
	updateUserProfile: UpdateUserProfile
	verifyAndReadAccessToken: VerifyAndReadAccessToken
}): AuthUpdateAccessToken =>

function authUpdateAccessToken(accessToken?: AccessToken) {
	if (accessToken) {
		const userProfile = context.verifyAndReadAccessToken(accessToken)
		context.updateUserProfile(userProfile)
	}
	else {
		context.updateUserProfile(undefined)
	}
}
