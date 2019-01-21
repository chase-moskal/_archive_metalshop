
import {AuthStore} from "./auth-store"

export interface AuthTokens {
	nToken: string
	zToken: string
}

export interface AuthMachineOptions {
	authStore?: AuthStore
	authServerUrl: string
}
