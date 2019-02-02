
import {
	AccessToken,
	UpdateUserProfile,
	VerifyAndReadAccessToken
} from "../interfaces"

export type AuthUpdateAccessToken = (accessToken?: AccessToken) => void

export const hocAuthUpdateAccessToken = ({
	updateUserProfile,
	verifyAndReadAccessToken
}: HocAuthUpdateAccessTokenContext): AuthUpdateAccessToken =>
function authUpdateAccessToken(accessToken?: AccessToken) {
	if (accessToken) {
		const userProfile = verifyAndReadAccessToken(accessToken)
		updateUserProfile(userProfile)
	}
	else {
		updateUserProfile(undefined)
	}
}

export interface HocAuthUpdateAccessTokenContext {
	updateUserProfile: UpdateUserProfile
	verifyAndReadAccessToken: VerifyAndReadAccessToken
}
