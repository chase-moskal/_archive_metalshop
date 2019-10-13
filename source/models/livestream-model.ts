
import {makeReader} from "../toolbox/make-reader.js"
import {
	Livestream,
	LoginDetail,
	GetAuthContext,
	LivestreamState,
	RestrictedLivestream,
} from "../system/interfaces.js"

export enum LivestreamMode {
	LoggedOut,
	Unprivileged,
	Privileged,
	Admin,
}

export function createLivestreamModel({restrictedLivestream}: {
	restrictedLivestream: RestrictedLivestream
}) {
	let getAuthContext: GetAuthContext
	const state: LivestreamState = {
		livestream: null,
		mode: LivestreamMode.LoggedOut,
	}

	const {reader, publishStateUpdate} = makeReader(state)

	return {
		reader,
		actions: {
			async updateLivestream(livestream: Livestream) {
				const {accessToken} = await getAuthContext()
				await restrictedLivestream.updateLivestream({accessToken, livestream})
				state.livestream = livestream
				publishStateUpdate()
			}
		},
		wiring: {
			async receiveUserLoading() {
				state.mode = LivestreamMode.LoggedOut
				state.livestream = null
				publishStateUpdate()
			},
			async receiveUserLogin(detail: LoginDetail) {
				state.livestream = null
				publishStateUpdate()
				getAuthContext = detail.getAuthContext
				const {user, accessToken} = await getAuthContext()
				state.mode = user.claims.admin
					? LivestreamMode.Admin
					: user.claims.premium
						? LivestreamMode.Privileged
						: LivestreamMode.Unprivileged
				publishStateUpdate()
				state.livestream = await restrictedLivestream.getLivestream({
					accessToken
				})
				publishStateUpdate()
			},
			async receiveUserLogout() {
				state.mode = LivestreamMode.LoggedOut
				state.livestream = null
				publishStateUpdate()
			}
		}
	}
}
