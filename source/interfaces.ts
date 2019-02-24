
import {AccessData} from "authoritarian"

////////////////////////////
////////////////////////////

export interface AuthController {
	passiveCheck
	promptUserLogin
	logout
	authStore
}

export type SetAccessData = (accessData: AccessData) => void
