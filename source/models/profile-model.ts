
import {observable, action} from "mobx"
import {ProfileMagistrateTopic, Profile} from "authoritarian/dist/interfaces.js"

import {AuthoritarianProfileError} from "../system/errors.js"
import {AuthMode, ProfileMode, GetAuthContext, AuthPayload} from "../interfaces.js"

export class ProfileModel {
	@observable profile: Profile = null
	@observable displayAdminFeatures: boolean = false
	@observable mode: ProfileMode = ProfileMode.Loading
	private cancel: boolean = false
	private getAuthContext: GetAuthContext
	private profileMagistrate: ProfileMagistrateTopic

	constructor(options: {
		profileMagistrate: ProfileMagistrateTopic
	}) { Object.assign(this, options) }

	@action.bound async handleAuthUpdate({mode, getAuthContext}: AuthPayload) {
		this.getAuthContext = getAuthContext
		if (mode === AuthMode.LoggedIn) {
			this.cancel = false
			this.setProfileAndMode(null, ProfileMode.Loading)
			try {
				const loaded = await this.loadProfile()
				const profile = this.cancel ? null : loaded
				this.setProfileAndMode(profile, ProfileMode.Loaded)
			}
			catch (error) {
				console.error(error)
				this.setProfileAndMode(null, ProfileMode.Error)
			}
		}
		else if (mode === AuthMode.Loading) {
			this.cancel = true
			this.setProfileAndMode(null, ProfileMode.Loading)
		}
		else if (mode === AuthMode.Error) {
			this.cancel = true
			this.setProfileAndMode(null, ProfileMode.Error)
		}
		else {
			this.setProfileAndMode(null, ProfileMode.None)
		}
	}

	@action.bound async saveProfile(profile: Profile): Promise<void> {
		try {
			this.mode = ProfileMode.Loading
			const {accessToken} = await this.getAuthContext()
			await this.profileMagistrate.setProfile({accessToken, profile})
			this.setProfileAndMode(profile, ProfileMode.Loaded)
		}
		catch (error) {
			console.error(error)
			this.setProfileAndMode(null, ProfileMode.Error)
		}
	}

	@action.bound async loadProfile() {
		const {user} = await this.getAuthContext()
		const {userId} = user
		const profile = await this.profileMagistrate.getProfile({userId})
		if (!profile) {
			const error = new AuthoritarianProfileError(`failed to load profile`)
			console.error(error)
		}
		return profile
	}

	@action.bound private setProfileAndMode(
		profile: Profile,
		mode: ProfileMode,
	) {
		this.profile = profile
		this.mode = mode
	}
}
