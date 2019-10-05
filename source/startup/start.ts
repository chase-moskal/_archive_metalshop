
import {createUserModel} from "../models/user-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel} from "../models/paywall-model.js"

import {exist} from "../toolbox/exist.js"
import {createEventListener} from "../toolbox/event-listener.js"

import {AuthoritarianStartupError} from "../errors.js"
import {AuthoritarianOptions, UserModel} from "../interfaces.js"
import {UserLoginEvent, UserLogoutEvent, UserErrorEvent} from "../events.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function start({
	debug,

	profiler,
	tokenStorage,
	paywallGuardian,

	loginPopupRoutine,
	decodeAccessToken,

	userPanels,
	eventTarget,
	userButtons,
	profilePanels,
	paywallPanels,
}: AuthoritarianOptions) {

	logEventsInDebugMode()

	//
	// high level startup sequence
	// compose the system by creating models
	// give them access to the dom and their microservice dependencies
	//

	if (exist(userPanels, userButtons)) {
		if (exist(profilePanels)) createProfileModel({profiler, eventTarget})
		const userModel = await setupUser()
		if (exist(paywallPanels)) await setupPaywall(userModel)
		await userModel.start()
	}
	else throw err(`no relevant html elements found`)

	//
	// lower level functions help setup the models
	//

	async function setupUser() {
		const userModel = createUserModel({
			eventTarget,
			tokenStorage,
			loginPopupRoutine,
			decodeAccessToken,
		})
		// give panels the ability to login and logout
		for (const userPanel of userPanels) {
			userPanel.onLoginClick = userModel.login
			userPanel.onLogoutClick = userModel.logout
		}
		return userModel
	}

	async function setupPaywall(userModel: UserModel) {
		const paywallModel = createPaywallModel({
			paywallGuardian,
			onStateUpdate: () => {
				for (const panel of paywallPanels)
					panel.requestUpdate()
			},
			loginWithAccessToken: userModel.loginWithAccessToken
		})
		for (const panel of paywallPanels)
			panel.access = paywallModel.panelAccess
		createEventListener(UserLoginEvent, window, {}, event => {
			const {getAuthContext} = event.detail
			paywallModel.appAccess.actions.notifyUserLogin({getAuthContext})
		})
		createEventListener(UserLogoutEvent, window, {}, () => {
			paywallModel.appAccess.actions.notifyUserLogout()
		})
		createEventListener(UserErrorEvent, window, {}, () => {
			paywallModel.appAccess.actions.notifyUserLogout()
		})
		return paywallModel
	}

	function logEventsInDebugMode() {
		if (debug) for (const event of [
			"user-error",
			"user-login",
			"user-logout",
			"user-loading",
			"profile-error",
			"profile-update",
		]) window.addEventListener(event, () => console.log(event))
	}
}
