
import {AuthMode} from "./constants.js"
import {LoginDetail} from "../../interfaces.js"
import {AuthState, AuthActions} from "./interfaces.js"
import {actionelize, observelize} from "../../framework/mobb.js"

export function makeAuthBrain() {

	// observable mobx state
	const state: AuthState = observelize({
		getAuthContext: null,
		mode: AuthMode.Loading,
	})

	// actions can mutate state
	const actions: AuthActions = actionelize({
		modeLoading() {
			state.mode = AuthMode.Loading
			state.getAuthContext = null
		},
		modeLoggedIn({getAuthContext}: LoginDetail) {
			state.mode = AuthMode.LoggedIn
			state.getAuthContext = getAuthContext
		},
		modeError(error: Error) {
			state.mode = AuthMode.Error
			state.getAuthContext = null
			console.error(error)
		},
		modeLogout() {
			state.mode = AuthMode.LoggedOut
			state.getAuthContext = null
		},
	})

	// return the brain!
	return {state, actions}
}
