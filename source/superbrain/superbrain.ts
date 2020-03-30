
import {observable, computed, action} from "mobx"

import {AccessToken, ProfileMagistrateTopic} from "authoritarian/dist/interfaces.js"
import {actionelize, observelize} from "../framework/mobb.js"
import {LoginDetail, AuthContext, GetAuthContext} from "../interfaces.js"
import { ascertainOptionsFromDom } from "source/startup/more/ascertain-options-from-dom.js"

export enum AuthMode {
	Error,
	Loading,
	LoggedIn,
	LoggedOut,
}

export class AuthModel {
	@observable getAuthContext: GetAuthContext
	@observable mode: AuthMode = AuthMode.Loading

	@action.bound setError(error: Error) {
		this.mode = AuthMode.Error
		this.getAuthContext = null
		console.error(error)
	}

	@action.bound setLoading() {
		this.mode = AuthMode.Loading
		this.getAuthContext = null
	}

	@action.bound setLoggedIn({getAuthContext}: LoginDetail) {
		this.mode = AuthMode.LoggedIn
		this.getAuthContext = getAuthContext
	}

	@action.bound setLoggedOut() {
		this.mode = AuthMode.LoggedOut
		this.getAuthContext = null
	}
}

export enum ProfileMode {
	Error,
	Loading,
	Loaded,
	None,
}

export class ProfileModel {
	#auth: AuthModel
	#profileMagistrate: ProfileMagistrateTopic

	constructor({auth, profileMagistrate}: {
		auth: AuthModel
		profileMagistrate: ProfileMagistrateTopic
	}) {
		this.#auth = auth
		#profileMagistrate = profileMagistrate
	}

	@observable profile: null
	@observable mode: ProfileMode.Loading
	@observable displayAdminFeatures: false

	@action.bound async saveProfile(profile: Profile): Promise<void> {
		try {
			this.mode = ProfileMode.Loading
			const {accessToken} = await getAuthContext()
			await this.profileMagistrate.setProfile({accessToken, profile})
			this.profile = profile
		}
		catch (error) {
			state.error = error
			state.profile = null
			console.error(error)
		}
		state.loading = false
		computeAdmin()
		update()
	}

	@action.bound async handleAuthUpdate() {}

	@action.bound #setProfile() {}
}
