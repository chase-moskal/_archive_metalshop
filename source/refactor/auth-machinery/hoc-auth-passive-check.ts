
import {TokenApi} from "../interfaces"

import {AuthUpdateAccessToken} from "./hoc-auth-update-access-token"

export const hocAuthPassiveCheck = ({
	tokenApi,
	authUpdateAccessToken
}: HocAuthPassiveCheck) => async function authPassiveCheck() {
	try {
		const accessToken = await tokenApi.obtainAccessToken()
		authUpdateAccessToken(accessToken)
	}
	catch (error) {
		authUpdateAccessToken(undefined)
		throw error
	}
}

export interface HocAuthPassiveCheck {
	tokenApi: TokenApi
	authUpdateAccessToken: AuthUpdateAccessToken
}
