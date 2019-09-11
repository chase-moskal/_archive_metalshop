
import {Topic} from "renraku"
import {User, AccessToken} from "authoritarian"

export interface AuthContext {
	user: User
	accessToken: AccessToken
}

export interface UserProfile {
	picture: string
	realname: string
	nickname: string
}

export interface PaywallGuardianTopic extends Topic {
	makeUserPremium(options: {accessToken: AccessToken}): Promise<AccessToken>
	revokeUserPremium(options: {accessToken: AccessToken}): Promise<AccessToken>
}

export interface ProfileManagerTopic {
	getProfile(options: {accessToken: AccessToken}): Promise<UserProfile>
	setProfile(options: {accessToken: AccessToken, profile: UserProfile}): Promise<void>
}

export interface UserLoginDetail {
	authContext: AuthContext
}

export interface UserSubpanel {
	authContext: AuthContext
}
