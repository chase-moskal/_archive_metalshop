
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

	const avatar = createAvatarModel()

	//
	// wire models to dom and each other
	//

	// wire user to receive token from paywall
	paywall.wiring.loginWithAccessToken(
		user.actions.loginWithAccessToken
	)

	// for (const component of [...userButtons, ...profilePanels]) {
	// 	component.avatarReader = avatar.reader
	// }

	// profile.reader.subscribe(() => {
	// 	const {state} = profile.reader
	// 	avatar.setPictureUrl(state.public.url)
	// })

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

	// function setupAvatar() {
	// 	const {reader: avatarReadAccess, actions: avatarWriteAccess} = createAvatarModel()
	// 	createEventListener(
	// 		ProfileUpdateEvent, eventTarget, {},
	// 		event => {
	// 			avatarWriteAccess.setPictureUrl(event.detail.profile.public.picture)
	// 		}
	// 	)
	// 	createEventListener(
	// 		ProfileErrorEvent, eventTarget, {},
	// 		event => {
	// 			avatarWriteAccess.setPictureUrl(null)
	// 		}
	// 	)
	// 	for (const component of [...userButtons, ...profilePanels])
	// 		component.avatarReadAccess = avatarReadAccess
	// }

	// async function setupUser() {
	// 	const userModel = createUserModel({
	// 		eventTarget,
	// 		tokenStorage,
	// 		loginPopupRoutine,
	// 		decodeAccessToken,
	// 	})
	// 	for (const userPanel of userPanels) {
	// 		userPanel.onLoginClick = userModel.login
	// 		userPanel.onLogoutClick = userModel.logout
	// 	}
	// 	return userModel
	// }

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
