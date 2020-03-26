
import {AuthMode} from "./constants.js"
import {GetAuthContext, LoginDetail} from "../../interfaces.js"

export interface AuthState {
	mode: AuthMode
	getAuthContext: GetAuthContext | null
}

export interface AuthActions {
	modeLoading(): void
	modeLoggedIn(options: LoginDetail): void
	modeError(error: Error): void
	modeLogout(): void
}
