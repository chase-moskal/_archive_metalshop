
import {createUserModel} from "../models/user-model.js"
import {createAvatarModel} from "../models/avatar-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel} from "../models/paywall-model.js"

import {exist} from "../toolbox/exist.js"
import {createEventListener} from "../toolbox/event-listener.js"

import {AuthoritarianStartupError} from "../system/errors.js"
import {AuthoritarianOptions, UserModel} from "../system/interfaces.js"
import {UserLoginEvent, UserLogoutEvent, UserErrorEvent, ProfileUpdateEvent, ProfileErrorEvent} from "../system/events.js"

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

	// logEventsInDebugMode()

	if (!exist(userPanels, userButtons))
		throw err(`no relevant html elements found`)

	//
	// instance the models
	//

	const user = createUserModel({
		tokenStorage,
		decodeAccessToken,
		loginPopupRoutine,
	})

	const paywall = createPaywallModel({
		paywallGuardian,
	})

	const profile = createProfileModel({
		profiler
	})

	const avatar = createAvatarModel()

	//
	// wire models to dom and each other
	//

	// wire user to receive token from paywall
	paywall.wiring.loginWithAccessToken(
		user.actions.loginWithAccessToken
	)

	// update avatar picture on profile update
	profile.reader.subscribe(() => {
		const {state} = profile.reader
		if (!state.profile) return
		const {picture} = profile.reader.state.profile.public
		if (picture) avatar.actions.setPictureUrl(picture)
	})

	// attach component readers
	for (const component of [...userButtons, ...profilePanels])
		component.avatarReader = avatar.reader
	for (const component of paywallPanels)
		component.reader

	// user panel login/logout clicks
	for (const userPanel of userPanels) {
		userPanel.onLoginClick = user.actions.login
		userPanel.onLogoutClick = user.actions.logout
	}

	return {
		async start() { return user.actions.start() },
		supermodel: {
			user,
			avatar,
			paywall,
			// profile,
		}
	}








	// if (exist(userPanels, userButtons)) {
	// 	if (exist(profilePanels)) createProfileModel({profiler, eventTarget})
	// 	setupAvatar()
	// 	const userModel = await setupUser()
	// 	if (exist(paywallPanels)) await setupPaywall(userModel)
	// 	await userModel.start()
	// }
	// else throw err(`no relevant html elements found`)

	// //
	// // lower level functions help setup the models
	// //

	// async function setupPaywall(userModel: UserModel) {
	// 	const paywallModel = createPaywallModel({
	// 		paywallGuardian,
	// 		onStateUpdate: () => {
	// 			for (const panel of paywallPanels)
	// 				panel.requestUpdate()
	// 		},
	// 		loginWithAccessToken: userModel.loginWithAccessToken
	// 	})
	// 	for (const panel of paywallPanels)
	// 		panel.access = paywallModel.panelAccess
	// 	createEventListener(UserLoginEvent, window, {}, event => {
	// 		const {getAuthContext} = event.detail
	// 		paywallModel.appAccess.actions.notifyUserLogin({getAuthContext})
	// 	})
	// 	createEventListener(UserLogoutEvent, window, {}, () => {
	// 		paywallModel.appAccess.actions.notifyUserLogout()
	// 	})
	// 	createEventListener(UserErrorEvent, window, {}, () => {
	// 		paywallModel.appAccess.actions.notifyUserLogout()
	// 	})
	// 	return paywallModel
	// }

	// function logEventsInDebugMode() {
	// 	if (debug) for (const event of [
	// 		"user-error",
	// 		"user-login",
	// 		"user-logout",
	// 		"user-loading",
	// 		"profile-error",
	// 		"profile-update",
	// 	]) window.addEventListener(event, () => console.log(event))
	// }
}
