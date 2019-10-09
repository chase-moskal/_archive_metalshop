
import {createUserModel} from "../models/user-model.js"
import {createAvatarModel} from "../models/avatar-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel} from "../models/paywall-model.js"

import {exist} from "../toolbox/exist.js"
import {AuthoritarianOptions, Reader} from "../system/interfaces.js"
import {AuthoritarianStartupError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function wire({
	debug,

	profiler,
	tokenStorage,
	paywallGuardian,
	loginPopupRoutine,
	decodeAccessToken,

	userPanels,
	userButtons,
	profilePanels,
	paywallPanels,
	avatarDisplays,
}: AuthoritarianOptions) {

	if (!exist(userPanels, userButtons))
		throw err(`none of the required <user-panel> or <user-button> elements `
			+ `were found`)

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

	const wireStateDistribution = (reader: Reader, state: any) => {}

	profile.reader.subscribe(state => {
		for (const profilePanel of profilePanels) {
			profilePanel.state = state
		}
	})

	for (const profilePanel of profilePanels) {
		profilePanel.reader = profile.reader
		profilePanel.avatarReader = avatar.reader
	}

	for (const userButton of userButtons) {
		userButton.avatarReader = avatar.reader
	}

	for (const paywallPanel of paywallPanels) {
		paywallPanel.reader = paywall.reader
		paywallPanel.actions = paywall.actions
	}

	for (const userPanel of userPanels) {
		userPanel.reader = user.reader
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
