
import {User, AccessToken, AuthTokens} from "authoritarian/dist/interfaces.js"

export interface AuthContext {
	user: User
	accessToken: AccessToken
}

export type AccountPopupLogin = (authServerUrl: string) => Promise<AuthTokens>
