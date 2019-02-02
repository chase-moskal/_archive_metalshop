
import {TokenApi} from "../interfaces"

import {AuthUpdateAccessToken} from "./prep-auth-update-access-token"

export const prepAuthLogout = (context: {
	tokenApi: TokenApi
	authUpdateAccessToken: AuthUpdateAccessToken
}) =>

async function authLogout() {
	await context.tokenApi.clearTokens()
	context.authUpdateAccessToken(undefined)
}
