
import {LoginApi} from "../interfaces"

import {AuthUpdateAccessToken} from "./hoc-auth-update-access-token"

export const hocAuthPromptUserLogin = ({
	loginApi,
	authUpdateAccessToken
}: HocAuthPromptUserLoginContext) => async function authPassiveCheck() {
	try {
		const accessToken = await loginApi.userLoginRoutine()
		authUpdateAccessToken(accessToken)
	}
	catch (error) {
		authUpdateAccessToken(undefined)
		throw error
	}
}

export interface HocAuthPromptUserLoginContext {
	loginApi: LoginApi
	authUpdateAccessToken: AuthUpdateAccessToken
}
