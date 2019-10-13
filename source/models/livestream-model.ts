
import {makeReader} from "../toolbox/make-reader.js"
import {
	Livestream,
	LoginDetail,
	GetAuthContext,
	LivestreamState,
} from "../system/interfaces.js"

export enum LivestreamMode {
	LoggedOut,
	Unprivileged,
	Privileged,
	Admin,
}

export function createLivestreamModel() {
	let getAuthContext: GetAuthContext
	const state: LivestreamState = {
		livestream: null,
		mode: LivestreamMode.LoggedOut,
	}

	const {reader, publishStateUpdate} = makeReader(state)

	return {
		reader,
		actions: {
			async updateLivestream(livestream: Livestream) {}
		},
		wiring: {
			async receiveUserLoading() {
				state.mode = LivestreamMode.LoggedOut
				publishStateUpdate()
			},
			async receiveUserLogin(detail: LoginDetail) {
				getAuthContext = detail.getAuthContext
				const {user} = await getAuthContext()
				state.mode = user.claims.admin
					? LivestreamMode.Admin
					: user.claims.premium
						? LivestreamMode.Privileged
						: LivestreamMode.Unprivileged
				publishStateUpdate()
			},
			async receiveUserLogout() {
				state.mode = LivestreamMode.LoggedOut
				publishStateUpdate()
			}
		}
	}
}
