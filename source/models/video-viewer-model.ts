
import {VimeoGovernorTopic} from "authoritarian/dist/interfaces.js"

import {makeReader} from "../toolbox/pubsub.js"

import {
	UserModel,
	UserState,
	VideoViewerModel,
	VimeoState,
	VideoModel,
	GetAuthContext,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

export enum PrivilegeMode {
	LoggedOut,
	Unprivileged,
	Privileged,
	Admin,
}

export function createVideoViewerModel({user, vimeoGovernor}: {
	user: UserModel
	vimeoGovernor: VimeoGovernorTopic
}): VideoViewerModel {

	let getAuthContext: GetAuthContext

	const prepareVideoModel = ({videoName}: {videoName: string}): VideoModel => {
		const state: VimeoState = {
			loading: false,
			vimeoId: null,
			errorMessage: null,
			validationMessage: null,
			mode: PrivilegeMode.LoggedOut,
		}

		const {reader, update} = makeReader(state)

		const videoModel: VideoModel = {
			reader,

			async updateVideo(vimeostring: string) {
				vimeostring = vimeostring.trim()
				state.loading = true
				state.errorMessage = null
				state.validationMessage = null
				update()

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
					await vimeoGovernor.setVimeo({
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
				update()
			},

			async receiveUserUpdate({mode, getAuthContext: getContext}: UserState) {
				getAuthContext = getContext
				if (mode === UserMode.LoggedIn) {
					state.loading = true
					state.vimeoId = null
					state.errorMessage = null
					state.validationMessage = null
					update()
					const {user, accessToken} = await getAuthContext()
					state.mode = user.claims.admin
						? PrivilegeMode.Admin
						: user.claims.premium
							? PrivilegeMode.Privileged
							: PrivilegeMode.Unprivileged
					update()
					const {vimeoId} = await vimeoGovernor.getVimeo({
						accessToken,
						videoName
					})
					state.vimeoId = vimeoId
					state.loading = false
				}
				else if (mode === UserMode.Loading) {
					state.mode = PrivilegeMode.LoggedOut
					state.loading = false
					state.vimeoId = null
					state.errorMessage = null
					state.validationMessage = null
				}
				else {
					state.mode = PrivilegeMode.LoggedOut
					state.loading = false
					state.vimeoId = null
					state.errorMessage = null
					state.validationMessage = null
				}
				update()
			},
		}

		user.reader.subscribe(videoModel.receiveUserUpdate)
		videoModel.receiveUserUpdate(user.reader.state)

		return videoModel
	}

	return {prepareVideoModel}
}
