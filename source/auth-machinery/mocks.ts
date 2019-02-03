
import {LoginApi, TokenApi, DecodeAccessToken} from "./interfaces"

export interface Mockups<T> {
	[mock: string]: T
}

export const mocks = {
	loginApi: {
		good: <LoginApi>{
			async userLoginRoutine() { return "a123" }
		},
		bad: <LoginApi>{
			async userLoginRoutine() { throw new Error(`login failed`) }
		}
	},
	tokenApi: {
		good: <TokenApi>{
			async obtainAccessToken() { return "a123" },
			async clearTokens() { return null }
		},
		bad: <TokenApi>{
			async obtainAccessToken() { throw new Error(`failed to obtain token`) },
			async clearTokens() { throw new Error(`failed to clear tokens`) }
		}
	},
	decodeAccessToken: {
		good: <DecodeAccessToken>(() => ({
			name: "Chase Moskal",
			profilePicture: "chase.jpg"
		})),
		bad: <DecodeAccessToken>(() => {
			throw new Error("access token decoder error")
		})
	}
}
