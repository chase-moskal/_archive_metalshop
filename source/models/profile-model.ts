
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
	let cancel: boolean = false

	async function loadProfile(authContext: AuthContext): Promise<Profile> {
		const {accessToken} = authContext
		const profile = await profiler.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		return profile
	}

	const state: ProfileState = {
		error: null,
		loading: true,
		profile: null,
	}

	const {publishers, subscribers} = pubsubs<ProfileEvents>({
		stateUpdate: pubsub()
	})

	return {

		reader: makeReader<ProfileState>({
			state,
			subscribe: subscribers.stateUpdate
		}),

		actions: {
			async userLoading() {
				cancel = true
				state.error = null
				state.loading = true
				state.profile = null
			},

			async userLogin(detail: LoginDetail) {
				cancel = false
				try {
					const authContext = await detail.getAuthContext()
					const profile = await loadProfile(authContext)
					state.profile = cancel ? null : profile
				}
				catch (error) {
					console.error(error)
					state.error = true
				}
				state.loading = false
				publishers.stateUpdate()
			},

			async userLogout() {
				state.error = null
				state.profile = null
				state.loading = false
				publishers.stateUpdate()
			}
		}
	}
}
