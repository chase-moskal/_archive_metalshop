
import {AccessData} from "authoritarian"
import {AuthController, AuthStore, AuthMachineFundamentals} from "../interfaces.js"

export function createAuthController({
	tokenApi,
	loginApi,
	decodeAccessToken,
	onStoreUpdate
}: AuthMachineFundamentals): AuthController {

	//
	// function mixin utility
	//

	function updateAfter<T extends (...args: any[]) => any>(func: T) {
		return <T><any>(async(...args: any[]) => {
			let result: any
			try {
				result = await func(...args)
			}
			finally {
				onStoreUpdate()
				return result
			}
		})
	}

	//
	// private state
	//

	let accessData: AccessData

	//
	// publicly exposed
	//

	const store: AuthStore = {
		get loggedIn(): boolean {
			return !!accessData
		},
		get profilePicture(): string {
			return !!accessData && accessData.profilePicture
		}
	}

	const logout = updateAfter(
		async function logout() {
			try {
				await tokenApi.clearTokens()
			}
			finally {
				accessData = undefined
			}
		}
	)

	const passiveCheck = updateAfter(
		async function passiveCheck() {
			try {
				const accessToken = await tokenApi.obtainAccessToken()
				accessData = decodeAccessToken(accessToken)
			}
			catch (error) {
				accessData = undefined
				throw error
			}
		}
	)

	const promptUserLogin = updateAfter(
		async function promptUserLogin() {
			try {
				const accessToken = await loginApi.userLoginRoutine()
				accessData = decodeAccessToken(accessToken)
			}
			catch (error) {
				accessData = undefined
			}
		}
	)

	return {
		store,
		logout,
		passiveCheck,
		promptUserLogin
	}
}
