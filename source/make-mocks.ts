
import {LoginApi, TokenApi} from "authoritarian"

import {DecodeAccessToken} from "./interfaces"

export interface Mockups<T> {
	[mock: string]: T
}

export const makeMocks = ({logger = () => undefined}: {
	logger: typeof console.log
}) => ({
	loginApi: <LoginApi>{
		async userLoginRoutine() {
			logger("loginApi.userLoginRoutine")
			return "a123"
		}
	},
	tokenApi: <TokenApi>{
		async obtainAccessToken() {
			logger("tokenApi.obtainAccessToken")
			return "a123"
		},
		async clearTokens() {
			logger("tokenApi.clearTokens")
			return null
		}
	},
	decodeAccessToken: <DecodeAccessToken>(() => {
		logger("decodeAccessToken")
		return {
			name: "Chase Moskal",
			profilePicture: "https://chasemoskal.com/images/chase.small.jpg"
		}
	})
})
