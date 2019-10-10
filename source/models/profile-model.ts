
import {ProfilerTopic, Profile} from "authoritarian/dist/interfaces.js"
import {
	AuthContext,
	LoginDetail,
	ProfileModel,
	ProfileState,
} from "../system/interfaces.js"
import {makeReader} from "../toolbox/make-reader.js"

export function createProfileModel({profiler}: {profiler: ProfilerTopic}):
 ProfileModel {

	let authContext: AuthContext
	let cancel: boolean = false
	const state: ProfileState = {
		error: null,
		loading: true,
		profile: null,
	}

	const {reader, publishStateUpdate} = makeReader<ProfileState>(state)

	async function loadProfile(): Promise<Profile> {
		const {accessToken} = authContext
		const profile = await profiler.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		return profile
	}

	return {
		reader,
		actions: {
			async saveProfile(profile: Profile): Promise<void> {
				const {accessToken} = authContext
				await profiler.setFullProfile({accessToken, profile})
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
				cancel = false
				state.loading = true
				publishStateUpdate()
				try {
					authContext = await detail.getAuthContext()
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
