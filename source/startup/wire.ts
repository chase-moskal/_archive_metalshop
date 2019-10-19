
import {AuthoritarianStartupError} from "../system/errors.js"
import {wireStateUpdates} from "../toolbox/wire-state-updates.js"
import {
	UserState,
	AvatarState,
	PaywallState,
	ProfileState,
	AuthoritarianOptions,
	VimeoState,
} from "../system/interfaces.js"

import {createUserModel} from "../models/user-model.js"
import {createAvatarModel} from "../models/avatar-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPrivateVimeoModel} from "../models/private-vimeo-model.js"
import {createPaywallModel, PaywallMode} from "../models/paywall-model.js"

import {UserPanel} from "../components/user-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {PrivateVimeo} from "../components/private-vimeo.js"
import {AvatarDisplay} from "../components/avatar-display.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export async function wire({
	debug,

	profileMagistrate: profiler,
	tokenStorage,
	paywallGuardian,
	loginPopupRoutine,
	decodeAccessToken,
	privateVimeoGovernor,

	userPanels,
	profilePanels,
	paywallPanels,
	privateVimeos,
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

	// on user logout or error, reset avatar
	const resetAvatar = () => {
		avatar.wiring.setPremium(false)
		avatar.wiring.setPictureUrl(null)
	}
	user.subscribers.userError(resetAvatar)
	user.subscribers.userLogout(resetAvatar)

	//
	// wire models to dom elements
	//

	profile.subscribeReset(() => {
		for (const profilePanel of profilePanels)
			profilePanel.reset()
	})

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

	for (const profilePanel of profilePanels) {
		profilePanel.onProfileSave = profile.actions.saveProfile
	}

	for (const paywallPanel of paywallPanels) {
		paywallPanel.onMakeUserPremium = paywall.actions.makeUserPremium
		paywallPanel.onRevokeUserPremium = paywall.actions.revokeUserPremium
	}

	for (const userPanel of userPanels) {
		userPanel.onLoginClick = user.actions.login
		userPanel.onLogoutClick = user.actions.logout
	}

	//
	// funky complex wirings
	//

	for (const privateVimeo of privateVimeos) {

		// require [video-name] attributes
		const videoName = privateVimeo.getAttribute("video-name")
		if (!videoName) err(`<private-vimeo> is missing attribute [video-name]`)

		// create a model for each component
		const model = createPrivateVimeoModel({
			videoName,
			privateVimeoGovernor
		})

		// wire model to other models
		user.subscribers.userLogin(model.wiring.receiveUserLogin)
		user.subscribers.userError(model.wiring.receiveUserLogout)
		user.subscribers.userLogout(model.wiring.receiveUserLogout)
		user.subscribers.userLoading(model.wiring.receiveUserLoading)

		// wire model to component
		privateVimeo.onUpdateVideo = model.actions.updateVideo
		model.reader.subscribe(state => privateVimeo.vimeoState = state)
	}

	profile.wiring.publishStateUpdate()
	avatar.wiring.publishStateUpdate()
	paywall.wiring.publishStateUpdate()
	user.wiring.publishStateUpdate()

	//
	// debug logging
	//

	if (debug) {
		for (const [name, subscriber] of Object.entries(user.subscribers))
			subscriber(() => console.debug("event.user:", name))
		paywall.wiring.loginWithAccessToken(
			async() => console.debug("event.paywall:", "loginWithAccessToken")
		)
	}

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
