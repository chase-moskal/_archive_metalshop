
import {observable, action} from "mobx"

import {AuthoritarianProfileError} from "../system/errors.js"
import {ProfileMagistrateTopic, Profile} from "authoritarian/dist/interfaces.js"
import {LoginDetail, GetAuthContext, UserState} from "../interfaces.js"

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
	private auth: AuthModel
	private profileMagistrate: ProfileMagistrateTopic

	private cancel: boolean = false
	private getAuthContext: GetAuthContext

	constructor({auth, profileMagistrate}: {
		auth: AuthModel
		profileMagistrate: ProfileMagistrateTopic
	}) {
		this.auth = auth
		this.profileMagistrate = profileMagistrate
	}

	@observable profile: Profile = null
	@observable displayAdminFeatures: boolean = false
	@observable mode: ProfileMode = ProfileMode.Loading

	@action.bound async handleAuthUpdate({
		mode,
		getAuthContext,
	}: {
		mode: AuthMode
		getAuthContext: GetAuthContext
	}) {
		this.getAuthContext = getAuthContext

		if (mode === AuthMode.LoggedIn) {
			this.cancel = false
			this.setMode(ProfileMode.Loading)
			const {user} = await this.getAuthContext()
			try {
				const profile = await this.loadProfile()
				this.setProfile(profile)
				this.setMode(ProfileMode.Loaded)
			}
			catch (error) {
				console.error(error)
				this.setProfile(null)
				this.setMode(ProfileMode.Error)
			}
		}
		else if (mode === AuthMode.Loading) {
			this.cancel = true
			this.setProfile(null)
			this.setMode(ProfileMode.Loading)
		}
		else if (mode === AuthMode.Error) {
			this.cancel = true
			this.setProfile(null)
			this.setMode(ProfileMode.Error)
		}
		else {
			this.setProfile(null)
			this.setMode(ProfileMode.None)
		}
	}

	@action.bound async saveProfile(profile: Profile): Promise<void> {
		try {
			this.mode = ProfileMode.Loading
			const {accessToken} = await this.getAuthContext()
			await this.profileMagistrate.setProfile({accessToken, profile})
			this.setProfile(profile)
			this.setMode(ProfileMode.Loaded)
		}
		catch (error) {
			console.error(error)
			this.setProfile(null)
			this.setMode(ProfileMode.Error)
		}
	}

	@action.bound private async loadProfile() {
		const {user} = await this.getAuthContext()
		const {userId} = user
		const profile = await this.profileMagistrate.getProfile({userId})
		if (!profile) {
			const error = new AuthoritarianProfileError(`failed to load profile`)
			console.error(error)
		}
		return profile
	}

	@action.bound private setProfile(profile: Profile) {
		this.profile = profile
	}

	@action.bound private setMode(mode: ProfileMode) {
		this.mode = mode
	}
}
