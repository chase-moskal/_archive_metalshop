
import {AccessToken} from "authoritarian"

import {AuthController} from "../interfaces"
import {AuthStore} from "../stores/auth-store"
import {AuthMachineFundamentals} from "../interfaces"

export function createAuthController({
	tokenApi,
	loginApi,
	decodeAccessToken
}: AuthMachineFundamentals): AuthController {
	const {authStore, setAccessData} = AuthStore.create()

	const handleAccessToken = (accessToken?: AccessToken) => {
		if (accessToken) {
			const accessData = decodeAccessToken(accessToken)
			setAccessData(accessData)
		}
		else {
			setAccessData(undefined)
		}
	}

	async function passiveCheck() {
		try {
			const accessToken = await tokenApi.obtainAccessToken()
			handleAccessToken(accessToken)
		}
		catch (error) {
			handleAccessToken(undefined)
			throw error
		}
	}

	async function logout() {
		await tokenApi.clearTokens()
		handleAccessToken(undefined)
	}

	async function promptUserLogin() {
		try {
			const accessToken = await loginApi.userLoginRoutine()
			handleAccessToken(accessToken)
		}
		catch (error) {
			handleAccessToken(undefined)
			throw error
		}
	}

	return {
		logout,
		authStore,
		passiveCheck,
		promptUserLogin
	}
}
