
import {LoginApi, TokenApi, DecodeAccessToken} from "./auth-machinery/interfaces"

export interface Mockups<T> {
	[mock: string]: T
}

export const mocks = {
	loginApi: <Mockups<LoginApi>>{
		goodLogin: {
			async userLoginRoutine() { return "a123" }
		},
		badLogin: {
			async userLoginRoutine() { throw new Error(`login failed`) }
		}
	},
	tokenApi: <Mockups<TokenApi>>{
		goodTokens: {
			async obtainAccessToken() { return "a123" },
			async clearTokens() { return null }
		},
		badTokens: {
			async obtainAccessToken() { return "a123" },
			async clearTokens() { return null }
		}
	},
	decodeAccessToken: <Mockups<DecodeAccessToken>>{
		goodUserProfile: () => ({
			name: "Chase Moskal",
			profilePicture: "chase.jpg"
		})
	}
}
