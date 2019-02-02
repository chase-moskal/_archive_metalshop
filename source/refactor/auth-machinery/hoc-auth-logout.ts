
import {TokenApi} from "../interfaces"

import {
	AuthUpdateAccessToken
} from "./hoc-auth-update-access-token"

export interface HocAuthLogoutContext {
	tokenApi: TokenApi
	authUpdateAccessToken: AuthUpdateAccessToken
}

export const hocAuthLogout = ({
	tokenApi,
	authUpdateAccessToken
}: HocAuthLogoutContext) => async function authLogout() {
	await tokenApi.clearTokens()
	authUpdateAccessToken(undefined)
}
