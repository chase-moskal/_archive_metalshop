
import {ProfilerTopic, Profile} from "authoritarian/dist/interfaces.js"
import {pubsub, pubsubs} from "../toolbox/pubsub.js"
import {
	AuthContext,
	LoginDetail,
	ProfileModel,
	ProfileState,
	ProfileEvents,
} from "../system/interfaces.js"
import {makeReader} from "../toolbox/make-reader.js"

export function createProfileModel({profiler}: {
	profiler: ProfilerTopic
}): ProfileModel {

	async function loadProfile(authContext: AuthContext): Promise<Profile> {
		const {accessToken} = authContext
		const profile = await profiler.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		return profile
	}

	let cancel: boolean = false
	const state: ProfileState = {
		error: null,
		loading: true,
		profile: null,
	}

	const reader = makeReader<ProfileState>(state)
	const {publishStateUpdate} = reader

	return {
		reader,
		wiring: {
			async receiveUserLoading() {
				cancel = true
				state.error = null
				state.loading = true
				state.profile = null
				publishStateUpdate()
			},
			async receiveUserLogin(detail: LoginDetail) {
				cancel = false
				try {
					const authContext = await detail.getAuthContext()
					const profile = await loadProfile(authContext)
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
