
import {PrivateVimeoGovernorTopic} from "authoritarian/dist/interfaces"

import {makeReader} from "../toolbox/make-reader.js"
import {
	VimeoState,
	LoginDetail,
	GetAuthContext,
} from "../system/interfaces.js"

export enum PrivilegeMode {
	LoggedOut,
	Unprivileged,
	Privileged,
	Admin,
}

export function createPrivateVimeoModel({videoName, privateVimeoGovernor}: {
	videoName: string
	privateVimeoGovernor: PrivateVimeoGovernorTopic
}) {
	let getAuthContext: GetAuthContext
	const state: VimeoState = {
		loading: false,
		vimeoId: null,
		errorMessage: null,
		validationMessage: null,
		mode: PrivilegeMode.LoggedOut,
	}
	const {reader, publishStateUpdate} = makeReader(state)

	return {
		reader,
		actions: {
			async updateVideo(vimeostring: string) {
				vimeostring = vimeostring.trim()
				state.loading = true
				state.errorMessage = null
				state.validationMessage = null
				publishStateUpdate()

				let vimeoId: string
				{
					const idParse = /^\d{5,}$/i.exec(vimeostring)
					const linkParse = /vimeo\.com\/(\d{5,})/i.exec(vimeostring)
					if (idParse) {
						vimeoId = vimeostring
					}
					else if (linkParse) {
						vimeoId = linkParse[1]
					}
				}

				if (vimeoId || vimeostring === "") {
					const {accessToken} = await getAuthContext()
					await privateVimeoGovernor.setVimeo({
						accessToken,
						videoName,
						vimeoId
					})
					state.vimeoId = vimeoId
				}
				else {
					state.validationMessage = "invalid vimeo link or id"
				}
				state.loading = false
				publishStateUpdate()
			}
		},
		wiring: {
			async receiveUserLoading() {
				state.mode = PrivilegeMode.LoggedOut
				state.loading = true
				state.vimeoId = null
				state.errorMessage = null
				state.validationMessage = null
				publishStateUpdate()
			},
			async receiveUserLogin(detail: LoginDetail) {
				state.loading = true
				state.vimeoId = null
				state.errorMessage = null
				state.validationMessage = null
				publishStateUpdate()
				getAuthContext = detail.getAuthContext
				const {user, accessToken} = await getAuthContext()
				state.mode = user.public.claims.admin
					? PrivilegeMode.Admin
					: user.public.claims.premium
						? PrivilegeMode.Privileged
						: PrivilegeMode.Unprivileged
				publishStateUpdate()
				const {vimeoId} = await privateVimeoGovernor.getVimeo({
					accessToken,
					videoName
				})
				state.vimeoId = vimeoId
				state.loading = false
				publishStateUpdate()
			},
			async receiveUserLogout() {
				state.mode = PrivilegeMode.LoggedOut
				state.loading = false
				state.vimeoId = null
				state.errorMessage = null
				state.validationMessage = null
				publishStateUpdate()
			}
		}
	}
}
