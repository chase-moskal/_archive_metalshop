
import {AuthMode} from "./constants.js"
import {TokenStorageTopic} from "authoritarian/dist/interfaces.js"
import {GetAuthContext, LoginDetail, LoginPopupRoutine, DecodeAccessToken} from "../../interfaces.js"

export interface AuthBrainOptions {
	tokenStorage: TokenStorageTopic
	loginPopupRoutine: LoginPopupRoutine
	decodeAccessToken: DecodeAccessToken
}

export interface AuthState {
	mode: AuthMode
	getAuthContext: GetAuthContext | null
}

export interface AuthActions {
	modeLoading(): void
	modeError(error: Error): void
	modeLoggedOut(): void
	modeLoggedIn(detail: LoginDetail): void
}
