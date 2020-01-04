
import {
	Profile,
	ProfileMagistrateTopic,
} from "authoritarian/dist/interfaces.js"

import {pubsub} from "../toolbox/pubsub.js"
import {makeReader} from "../toolbox/pubsub.js"
import {AuthoritarianProfileError} from "../system/errors.js"

import {
	UserState,
	ProfileModel,
	ProfileState,
	GetAuthContext,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

export function createProfileModel({profileMagistrate}: {
	profileMagistrate: ProfileMagistrateTopic
}): ProfileModel {

	let getAuthContext: GetAuthContext
	let cancel: boolean = false

	const state: ProfileState = {
		error: null,
		admin: false,
		loading: true,
		profile: null,
		premium: false,
	}

	const {reader, update} = makeReader<ProfileState>(state)

	const {
		publish: publishReset,
		subscribe: subscribeReset,
	} = pubsub()

	async function loadProfile(): Promise<Profile> {
		const {accessToken, user} = await getAuthContext()
		const {userId} = user
		const profile = await profileMagistrate.getProfile({userId})
		if (!profile) console.warn("failed to load profile")
		return profile
	}

	return {
		reader,
		update,
		subscribeReset,
		async saveProfile(profile: Profile): Promise<void> {
			try {
				state.loading = true
				update()
				const {accessToken} = await getAuthContext()
				await profileMagistrate.setProfile({accessToken, profile})
				state.profile = profile
			}
			catch (error) {
				state.error = error
				state.profile = null
			}
			state.loading = false
			update()
		},
		async receiveUserUpdate({mode, getAuthContext: getContext}: UserState) {
			getAuthContext = getContext
			if (mode === UserMode.LoggedIn) {
				publishReset()
				cancel = false
				state.loading = true
				update()
				const {user} = await getAuthContext()
				state.admin = !!user.claims.admin
				state.premium = !!user.claims.premium
				update()
				try {
					const profile = await loadProfile()
					state.profile = cancel ? null : profile
				}
				catch (error) {
					console.error(error)
					state.error = error
				}
				state.loading = false
			}
			else if (mode === UserMode.Loading) {
				cancel = true
				state.error = null
				state.loading = true
				state.profile = null
				state.premium = false
			}
			else if (mode === UserMode.Error) {
				cancel = true
				state.error = new AuthoritarianProfileError("profile error")
				state.loading = true
				state.profile = null
				state.premium = false
			}
			else {
				state.error = null
				state.loading = false
				state.profile = null
				state.premium = false
			}
			update()
		},
	}
}
