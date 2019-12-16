
import {makeReader} from "../toolbox/pubsub.js"
import {PrivateVimeoGovernorTopic} from "authoritarian/dist/interfaces"
import {
	UserState,
	VimeoModel,
	VimeoState,
	GetAuthContext,
} from "../interfaces.js"
import { UserMode } from "./user-model.js"

export enum PrivilegeMode {
	LoggedOut,
	Unprivileged,
	Privileged,
	Admin,
}

export function createPrivateVimeoModel({videoName, privateVimeoGovernor}: {
	videoName: string
	privateVimeoGovernor: PrivateVimeoGovernorTopic
}): VimeoModel {

	let getAuthContext: GetAuthContext

	const state: VimeoState = {
		loading: false,
		vimeoId: null,
		errorMessage: null,
		validationMessage: null,
		mode: PrivilegeMode.LoggedOut,
	}

	const {reader, update} = makeReader(state)

	return {

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
				state.mode = user.public.claims.admin
					? PrivilegeMode.Admin
					: user.public.claims.premium
						? PrivilegeMode.Privileged
						: PrivilegeMode.Unprivileged
				update()
				const {vimeoId} = await privateVimeoGovernor.getVimeo({
					accessToken,
					videoName
				})
				state.vimeoId = vimeoId
				state.loading = false
				update()
			}
			else if (mode === UserMode.Loading) {
				state.mode = PrivilegeMode.LoggedOut
				state.loading = true
				state.vimeoId = null
				state.errorMessage = null
				state.validationMessage = null
				update()
			}
			else {
				state.mode = PrivilegeMode.LoggedOut
				state.loading = false
				state.vimeoId = null
				state.errorMessage = null
				state.validationMessage = null
				update()
			}
		},
	}
}
