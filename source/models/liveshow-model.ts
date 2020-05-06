

import {pubsub} from "../toolbox/pubsub.js"
import * as loading from "../toolbox/loading.js"
import {observable, action, runInAction} from "mobx"
import {AuthPayload, PrivilegeMode, GetAuthContext} from "../interfaces.js"
import {LiveshowGovernorTopic, User, AccessToken} from "authoritarian/dist/interfaces.js"

export type HandleAuthUpdate = (auth: loading.Load<AuthPayload>) => Promise<void>

/**
 * System-level liveshow state
 */
export class LiveshowModel {
	private liveshowGovernor: LiveshowGovernorTopic
	constructor(options: {
			liveshowGovernor: LiveshowGovernorTopic
		}) {
		Object.assign(this, options)
	}

	//
	// pubsub to mirror auth load to view models
	//

	authLoadPubsub = pubsub<HandleAuthUpdate>()

	handleAuthLoad(authLoad: loading.Load<AuthPayload>) {
		this.authLoadPubsub.publish(authLoad)
	}

	dispose() {
		this.authLoadPubsub.dispose()
	}

	//
	// function to create new view models
	//

	makeViewModel = ({videoName}: {videoName: string}): {
			dispose: () => void,
			viewModel: LiveshowViewModel,
		} => {
		const {liveshowGovernor} = this
		const viewModel = new LiveshowViewModel({
			videoName,
			liveshowGovernor,
		})
		const dispose = this.authLoadPubsub.subscribe(viewModel.handleAuthLoad)
		return {
			dispose,
			viewModel,
		}
	}
}

/**
 * Component-level liveshow state
 */
export class LiveshowViewModel {

	//
	// public observables
	//

	@observable vimeoId: string = null
	@observable load = loading.load<void>()
	@observable validationMessage: string = null
	@observable mode: PrivilegeMode = PrivilegeMode.Unknown

	//
	// private variables and constructor
	//

	private videoName: string
	private getAuthContext: GetAuthContext
	private liveshowGovernor: LiveshowGovernorTopic

	constructor(options: {
			videoName: string
			liveshowGovernor: LiveshowGovernorTopic
		}) {
		Object.assign(this, options)
	}

	//
	// public actions
	//

	@action.bound ascertainPrivilege(user: User): PrivilegeMode {
		return user.claims.admin
			? PrivilegeMode.Privileged
			: user.claims.premium
				? PrivilegeMode.Privileged
				: PrivilegeMode.Unprivileged
	}

	@action.bound async handleAuthLoad(authLoad: loading.Load<AuthPayload>) {

		// initialize observables
		this.load = loading.none()
		this.mode = <PrivilegeMode>PrivilegeMode.Unknown
		this.vimeoId = null
		this.validationMessage = null

		// setup variables
		this.getAuthContext = null
		const authIsReady: boolean = loading.isReady(authLoad)
		const getAuthContext = loading.payload(authLoad)?.getAuthContext
		const userIsLoggedIn = !!getAuthContext

		// logic for privileges and loading the video
		if (authIsReady) {
			if (userIsLoggedIn) {
				this.getAuthContext = getAuthContext
				const {user, accessToken} = await getAuthContext()

				// set privilege level
				const privilege = this.ascertainPrivilege(user)
				runInAction(() => this.mode = privilege)

				// load video
				if (privilege === PrivilegeMode.Privileged) {
					runInAction(() => this.load = loading.loading())
					const {vimeoId} = await this.loadVideo(accessToken)
					runInAction(() => this.vimeoId = vimeoId)
					runInAction(() => this.load = loading.ready())
				}
			}
			else this.mode = PrivilegeMode.Unprivileged
		}
	}

	@action.bound async updateVideo(vimeostring: string) {
		vimeostring = vimeostring.trim()
		this.validationMessage = null

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
			const {videoName, getAuthContext} = this
			const {accessToken} = await getAuthContext()
			await this.liveshowGovernor.setShow({
				vimeoId,
				videoName,
				accessToken,
			})
		}
		else {
			this.validationMessage = "invalid vimeo link or id"
		}
	}

	//
	// private functionality
	//

	@action.bound private async loadVideo(accessToken: AccessToken) {
		return await this.liveshowGovernor.getShow({
			accessToken,
			videoName: this.videoName,
		})
	}
}
