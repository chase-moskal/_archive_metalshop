
import {LoginApi, TokenApi} from "authoritarian"

import {DecodeAccessToken} from "./interfaces"

export interface Mockups<T> {
	[mock: string]: T
}

export const mocks = {
	loginApi: <LoginApi>{
		async userLoginRoutine() { return "a123" }
	},
	tokenApi: <TokenApi>{
		async obtainAccessToken() { return "a123" },
		async clearTokens() { return null }
	},
	decodeAccessToken: <DecodeAccessToken>(() => ({
		name: "Chase Moskal",
		profilePicture: "https://chasemoskal.com/images/chase.small.jpg"
	}))
}
