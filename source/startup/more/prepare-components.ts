
import {MetalAvatar} from "../../components/metal-avatar.js"
import {MetalAccount} from "../../components/metal-account.js"
import {MetalProfile} from "../../components/metal-profile.js"
import {MetalPaywall} from "../../components/metal-paywall.js"
import {MetalLiveshow} from "../../components/metal-liveshow.js"
import {MetalMyAvatar} from "../../components/metal-my-avatar.js"
import {MetalAdminMode} from "../../components/metal-admin-mode.js"
import {MetalAdminOnly} from "../../components/metal-admin-only.js"
import {MetalCountdown} from "../../components/countdown/metal-countdown.js"
import {MetalQuestions} from "../../components/questions/metal-questions.js"

import {objectMap} from "../../toolbox/object-map.js"
import {actionelize, observelize, computelize} from "../../framework/mobb.js"

import {createUserModel} from "../../models/user-model.js"
import {createProfileModel} from "../../models/profile-model.js"
import {createPaywallModel} from "../../models/paywall-model.js"
import {createScheduleModel} from "../../models/schedule-model.js"
import {createQuestionsModel} from "../../models/questions-model.js"
import {createVideoViewerModel} from "../../models/video-viewer-model.js"

import {provideModel} from "../../framework/provide-model.js"
import {AuthoritarianStartupError} from "../../system/errors.js"

import {AuthoritarianOptions} from "../../interfaces.js"

const err = (message: string) => new AuthoritarianStartupError(message)

const validate = (condition: any, message: string) => {
	if (!condition) throw err(message)
}

export function prepareComponents({
	tokenStorage,
	liveshowGovernor,
	scheduleSentry,
	paywallGuardian,
	questionsBureau,
	profileMagistrate,

	loginPopupRoutine,
	decodeAccessToken,
}: AuthoritarianOptions) {

	validate(
		tokenStorage && decodeAccessToken && loginPopupRoutine,
		"must have tokenStorage, decodeAccessToken, and "
			+ "loginPopupRoutine to instantiate the user model"
	)

	//
	// create mobx super state
	//

	const expiryGraceSeconds = 60

	enum AuthMode {
		Error,
		Loading,
		LoggedIn,
		LoggedOut,
	}

	enum ProfileMode {
		Error,
		Loading,
		Loaded,
		None,
	}

	const state = observelize({
		auth: {
			getAuthContext: null,
			mode: AuthMode.Loading,
			user: null
		},
		profile: {
			mode: ProfileMode.Loading,
			displayAdminFeatures: false,
			profile: null,
		},
		paywall: {},
		questions: {},
		schedule: {},
		videoViewer: {},
	})

	const computed = objectMap({

	}, item => computelize(item))

	const actions = objectMap({
		auth: {
			modeError(error: Error) {
				state.auth.mode = AuthMode.Error
				state.auth.getAuthContext = null
				console.error(error)
			},
			modeLoading() {
				state.auth.mode = AuthMode.Loading
				state.auth.getAuthContext = null
			},
			modeLoggedIn({getAuthContext}: LoginDetail) {
				state.auth.mode = AuthMode.LoggedIn
				state.auth.getAuthContext = getAuthContext
			},
			modeLoggedOut() {
				state.auth.mode = AuthMode.LoggedOut
				state.auth.getAuthContext = null
			},
		},
		profile: {
			saveProfile() {},
		},
		paywall: {

		},
		questions: {

		},
		schedule: {

		},
		videoViewer: {

		},
	}, item => actionelize(item))

	

	// //
	// // instance the models
	// //

	// const user = createUserModel({
	// 	tokenStorage,
	// 	decodeAccessToken,
	// 	loginPopupRoutine,
	// })

	// const paywall = createPaywallModel({
	// 	paywallGuardian,
	// })

	// const profile = createProfileModel({
	// 	profileMagistrate
	// })

	// const questions = createQuestionsModel({
	// 	questionsBureau
	// })

	// const viewer = createVideoViewerModel({
	// 	user,
	// 	liveshowGovernor,
	// })

	// const schedule = createScheduleModel({
	// 	user,
	// 	scheduleSentry,
	// })

	// //
	// // wire models to each other
	// //

	// user.reader.subscribe(paywall.receiveUserUpdate)
	// user.reader.subscribe(profile.receiveUserUpdate)
	// user.reader.subscribe(questions.receiveUserUpdate)
	// profile.reader.subscribe(state => questions.updateProfile(state.profile))
	// paywall.subscribeLoginWithAccessToken(user.receiveLoginWithAccessToken)

	// paywall.receiveUserUpdate(user.reader.state)
	// profile.receiveUserUpdate(user.reader.state)
	// questions.receiveUserUpdate(user.reader.state)
	// questions.updateProfile(profile.reader.state.profile)

	//
	// give back components and high level start function
	//

	return {
		components: {
			MetalAvatar,
			MetalAccount: provideModel(user, MetalAccount),
			MetalPaywall: provideModel(paywall, MetalPaywall),
			MetalProfile: provideModel(profile, MetalProfile),
			MetalLiveshow: provideModel(viewer, MetalLiveshow),
			MetalMyAvatar: provideModel(profile, MetalMyAvatar),
			MetalAdminMode: provideModel(profile, MetalAdminMode),
			MetalAdminOnly: provideModel(profile, MetalAdminOnly),
			MetalCountdown: provideModel(schedule, MetalCountdown),
			MetalQuestions: provideModel(questions, MetalQuestions),
		},
		async start() {
			return user.start()
		}
	}
}
