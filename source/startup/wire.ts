
import {createUserModel} from "../models/user-model.js"
import {createAvatarModel} from "../models/avatar-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel} from "../models/paywall-model.js"

import {exist} from "../toolbox/exist.js"
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

	if (!exist(userPanels, avatarDisplays))
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

	// wire together the paywall and the user model
	paywall.wiring.loginWithAccessToken(user.actions.loginWithAccessToken)
	user.subscribers.userLogin(detail => paywall.wiring.notifyUserLogin(detail))
	user.subscribers.userLogout(() => paywall.wiring.notifyUserLogout())
	user.subscribers.userError(() => paywall.wiring.notifyUserLogout())

	// on profile update, set avatar picture url
	profile.reader.subscribe(() => {
		const {state} = profile.reader
		if (!state.profile) return
		const {picture} = profile.reader.state.profile.public
		if (picture) avatar.actions.setPictureUrl(picture)
	})

	//
	// wire models to dom elements
	//

	wireStateUpdates<ProfileState, ProfilePanel>({
		initialPublish: true,
		reader: profile.reader,
		components: profilePanels,
		updateComponent: (component, state) => component.profileState = state,
	})

	wireStateUpdates<AvatarState, (ProfilePanel | AvatarDisplay)>({
		initialPublish: true,
		reader: avatar.reader,
		components: [...profilePanels, ...avatarDisplays],
		updateComponent: (component, state) => component.avatarState = state
	})

	wireStateUpdates<PaywallState, PaywallPanel>({
		initialPublish: true,
		reader: paywall.reader,
		components: paywallPanels,
		updateComponent: (component, state) => component.paywallState = state
	})

	wireStateUpdates<UserState, UserPanel>({
		initialPublish: true,
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

	//
	// put together the "supermodel"
	// - contains references to all of the models
	// - might be useful for debugging
	//

	const supermodel = {
		user,
		avatar,
		paywall,
		profile,
		async start() {
			return user.actions.start()
		}
	}

	if (debug) window["supermodel"] = supermodel
	return supermodel
}
