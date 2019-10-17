
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

import {AuthoritarianLivestreamError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianLivestreamError(message)

export function createLivestreamModel({restrictedLivestream}: {
	restrictedLivestream: RestrictedLivestream
}) {
	let getAuthContext: GetAuthContext
	const state: LivestreamState = {
		errorMessage: null,
		livestream: null,
		mode: LivestreamMode.LoggedOut,
	}

	const {reader, publishStateUpdate} = makeReader(state)

	return {
		reader,
		actions: {
			async updateLivestream(vimeostring: string) {
				vimeostring = vimeostring.trim()
				state.errorMessage = null
				publishStateUpdate()

				let id: string
				{
					const vimeoId = /^\d{5,}$/i.exec(vimeostring)
					const vimeoLink = /vimeo\.com\/(\d{5,})/i.exec(vimeostring)
					if (vimeoId) {
						id = vimeostring
					}
					else if (vimeoLink) {
						id = vimeoLink[1]
					}
				}

				if (id) {
					const livestream: Livestream = {
						embed: `<iframe src="https://player.vimeo.com/video/${id}?color=00a651&title=0&byline=0&portrait=0&badge=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
					}
					const {accessToken} = await getAuthContext()
					await restrictedLivestream.updateLivestream({accessToken, livestream})
					state.livestream = livestream
					publishStateUpdate()
				}
				else {
					state.errorMessage = "invalid vimeo link or id"
					publishStateUpdate()
				}
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
