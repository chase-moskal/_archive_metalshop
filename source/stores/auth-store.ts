
import {observable} from "mobx"

export class AuthStore {
	@observable loggedIn: boolean = false
	@observable authToken: string
	@observable accessToken: string
}
