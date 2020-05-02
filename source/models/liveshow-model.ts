
import {observable, action, runInAction} from "mobx"
import {LiveshowGovernorTopic} from "authoritarian/dist/interfaces.js"

import {pubsub} from "../toolbox/pubsub.js"
import {GetAuthContext, AuthMode, AuthUpdate, PrivilegeMode, ReceiveGetAuthContext} from "../interfaces.js"

export type HandleAuthUpdate = (update: AuthUpdate) => Promise<void>

export class LiveshowModel {
	private getAuthContext: GetAuthContext
	private liveshowGovernor: LiveshowGovernorTopic

	authUpdate = pubsub<HandleAuthUpdate>()
	handleAuthUpdate(update: AuthUpdate) { this.authUpdate.publish(update) }
	dispose() { this.authUpdate.dispose() }

	constructor(options: {
		liveshowGovernor: LiveshowGovernorTopic
	}) { Object.assign(this, options) }

	makeViewModel = ({videoName}: {videoName: string}): {
		dispose: () => void,
		viewModel: LiveshowViewModel,
	} => {
		const {liveshowGovernor} = this
		const viewModel = new LiveshowViewModel({
			videoName,
			liveshowGovernor,
			getAuthContext: () => this.getAuthContext(),
			receiveGetAuthContext: (getAuthContext: GetAuthContext) => {
				this.getAuthContext = getAuthContext
			},
		})
		const dispose = this.authUpdate.subscribe(viewModel.handleAuthUpdate)
		return {
			dispose,
			viewModel,
		}
	}
}

export class LiveshowViewModel {
	@observable vimeoId: string = null
	@observable loading: boolean = true
	@observable errorMessage: string = null
	@observable validationMessage: string = null
	@observable mode: PrivilegeMode = PrivilegeMode.Unknown
	private videoName: string
	private getAuthContext: GetAuthContext
	private liveshowGovernor: LiveshowGovernorTopic
	private receiveGetAuthContext: ReceiveGetAuthContext

	constructor(options: {
		videoName: string
		getAuthContext: GetAuthContext
		liveshowGovernor: LiveshowGovernorTopic
		receiveGetAuthContext: ReceiveGetAuthContext
	}) { Object.assign(this, options) }

	@action.bound async handleAuthUpdate({mode, getAuthContext}: AuthUpdate) {
		this.receiveGetAuthContext(getAuthContext)
		if (mode === AuthMode.LoggedIn) {
			runInAction(() => {
				this.mode = PrivilegeMode.Unprivileged
				this.loading = true
				this.vimeoId = null
				this.errorMessage = null
				this.validationMessage = null
			})
			const {user, accessToken} = await getAuthContext()
			runInAction(() => {
				this.mode = user.claims.admin
					? PrivilegeMode.Privileged
					: user.claims.premium
						? PrivilegeMode.Privileged
						: PrivilegeMode.Unprivileged
			})
			const {videoName} = this
			const {vimeoId} = await this.liveshowGovernor.getShow({
				videoName,
				accessToken,
			})
			runInAction(() => {
				this.loading = false
				this.vimeoId = vimeoId
			})
		}
		else if (mode === AuthMode.Loading) {
			runInAction(() => {
				this.vimeoId = null
				this.loading = false
				this.errorMessage = null
				this.validationMessage = null
				this.mode = PrivilegeMode.Unknown
			})
		}
		else {
			runInAction(() => {
				this.vimeoId = null
				this.loading = false
				this.errorMessage = null
				this.validationMessage = null
				this.mode = PrivilegeMode.Unknown
			})
		}
	}

	@action.bound async updateVideo(vimeostring: string) {
		vimeostring = vimeostring.trim()
		runInAction(() => {
			this.loading = true
			this.errorMessage = null
			this.validationMessage = null
		})

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
			const {videoName} = this
			const {accessToken} = await this.getAuthContext()
			await this.liveshowGovernor.setShow({
				vimeoId,
				videoName,
				accessToken,
			})
			runInAction(() => {
				this.vimeoId = vimeoId
			})
		}
		else {
			runInAction(() => {
				this.validationMessage = "invalid vimeo link or id"
			})
		}
		runInAction(() => {
			this.loading = false
		})
	}
}
