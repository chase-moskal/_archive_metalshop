
import {AuthController, AuthMachineFundamentals} from "../interfaces.js"

export function createAuthController({
	tokenApi,
	loginApi,
	decodeAccessToken
}: AuthMachineFundamentals): AuthController {
	const lol = Symbol()
	const authStore = {
		[lol]() {
			return "auth-store"
		}
	}

	async function logout() {}
	async function passiveCheck() {}
	async function promptUserLogin() {}

	return {
		logout,
		passiveCheck,
		promptUserLogin
	}
}
