
import {createUserModel} from "../models/user-model.js"
import {createAvatarModel} from "../models/avatar-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel, PaywallMode} from "../models/paywall-model.js"

import {AuthoritarianStartupError} from "../system/errors.js"
import {wireStateUpdates} from "../toolbox/wire-state-updates.js"
import {
	UserState,
	AvatarState,
	PaywallState,
	ProfileState,
	AuthoritarianOptions,
} from "../system/interfaces.js"

import {UserPanel} from "../components/user-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {AvatarDisplay} from "../components/avatar-display.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function wire({
	debug,

	profiler,
	tokenStorage,
	paywallGuardian,
	loginPopupRoutine,
	decodeAccessToken,

	userPanels,
	profilePanels,
	paywallPanels,
	avatarDisplays,
}: AuthoritarianOptions) {

	if (![...userPanels, ...avatarDisplays].length)
		throw err(`no elements found related to authoritarian`)

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
	// wire models to each other
	//

	// wire user to paywall
	paywall.wiring.loginWithAccessToken(user.wiring.loginWithAccessToken)
	user.subscribers.userLogin(paywall.wiring.receiveUserLogin)
	user.subscribers.userLogout(paywall.wiring.receiveUserLogout)
	user.subscribers.userError(paywall.wiring.receiveUserLogout)

	// wire user to profile
	user.subscribers.userLogin(profile.wiring.receiveUserLogin)
	user.subscribers.userError(profile.wiring.receiveUserLogout)
	user.subscribers.userLogout(profile.wiring.receiveUserLogout)
	user.subscribers.userLoading(profile.wiring.receiveUserLoading)

	// on profile update, set avatar picture url
	profile.reader.subscribe(state => {
		if (!state.profile) return
		const {picture} = profile.reader.state.profile.public
		if (picture) avatar.wiring.setPictureUrl(picture)
	})

	// on paywall update, set avatar premium
	paywall.reader.subscribe(state => {
		const premium = state.mode === PaywallMode.Premium
		avatar.wiring.setPremium(premium)
	})

	//
	// wire models to dom elements
	//

	wireStateUpdates<ProfileState, ProfilePanel>({
		reader: profile.reader,
		components: profilePanels,
		updateComponent: (component, state) => component.profileState = state
	})

	wireStateUpdates<AvatarState, (ProfilePanel | AvatarDisplay)>({
		reader: avatar.reader,
		components: [...profilePanels, ...avatarDisplays],
		updateComponent: (component, state) => component.avatarState = state
	})

	wireStateUpdates<PaywallState, PaywallPanel>({
		reader: paywall.reader,
		components: paywallPanels,
		updateComponent: (component, state) => component.paywallState = state
	})

	wireStateUpdates<UserState, UserPanel>({
		reader: user.reader,
		components: userPanels,
		updateComponent: (component, state) => component.userState = state
	})

	for (const paywallPanel of paywallPanels) {
		paywallPanel.onMakeUserPremium = paywall.actions.makeUserPremium
		paywallPanel.onRevokeUserPremium = paywall.actions.revokeUserPremium
	}

	for (const userPanel of userPanels) {
		userPanel.onLoginClick = user.actions.login
		userPanel.onLogoutClick = user.actions.logout
	}

	profile.wiring.publishStateUpdate()
	avatar.wiring.publishStateUpdate()
	paywall.wiring.publishStateUpdate()
	user.wiring.publishStateUpdate()

	//
	// return the "supermodel"
	// - contains references to all of the models
	// - might be useful for debugging
	// - could be basis of extensibility
	//

	const supermodel = {
		user,
		avatar,
		paywall,
		profile,
		async start() {
			return user.wiring.start()
		}
	}

	if (debug) window["supermodel"] = supermodel
	return supermodel
}
