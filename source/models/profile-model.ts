
import {ProfileMagistrateTopic, Profile} from "authoritarian/dist/interfaces.js"
import {
	LoginDetail,
	ProfileModel,
	ProfileState,
	GetAuthContext,
} from "../system/interfaces.js"
import {pubsub} from "../toolbox/pubsub.js"
import {makeReader} from "../toolbox/make-reader.js"

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

	const {reader, publishStateUpdate} = makeReader<ProfileState>(state)
	const {publish: publishReset, subscribe: subscribeReset} = pubsub()

	async function loadProfile(): Promise<Profile> {
		const {accessToken} = await getAuthContext()
		const profile = await profileMagistrate.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		return profile
	}

	return {
		reader,
		subscribeReset,
		actions: {
			async saveProfile(profile: Profile): Promise<void> {
				try {
					state.loading = true
					publishStateUpdate()
					const {accessToken} = await getAuthContext()
					await profileMagistrate.setFullProfile({accessToken, profile})
					state.profile = profile
				}
				catch (error) {
					state.error = error
					state.profile = null
				}
				state.loading = false
				publishStateUpdate()
			}
		},
		wiring: {
			publishStateUpdate,
			async receiveUserLoading() {
				cancel = true
				state.error = null
				state.loading = true
				state.profile = null
				publishStateUpdate()
			},
			async receiveUserLogin(detail: LoginDetail) {
				publishReset()
				getAuthContext = detail.getAuthContext
				cancel = false
				state.loading = true
				publishStateUpdate()
				const {user} = await getAuthContext()
				state.admin = !!user.public.claims.admin
				state.premium = !!user.public.claims.premium
				publishStateUpdate()
				try {
					const profile = await loadProfile()
					state.profile = cancel ? null : profile
				}
				catch (error) {
					console.error(error)
					state.error = error
				}
				state.loading = false
				publishStateUpdate()
			},
			async receiveUserLogout() {
				state.error = null
				state.profile = null
				state.loading = false
				publishStateUpdate()
			}
		}
	}
}
