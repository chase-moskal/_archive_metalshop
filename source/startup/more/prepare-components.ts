
import {MetalAccount} from "../../components/metal-account.js"
import {MetalMyAvatar} from "../../components/metal-my-avatar.js"
import {MetalLiveshow} from "../../components/metal-liveshow.js"
import {MetalProfile} from "../../components/metal-profile.js"
import {MetalPaywall} from "../../components/metal-paywall.js"
import {MetalAvatar} from "../../components/metal-avatar.js"
import {MetalQuestions} from "../../components/questions/metal-questions.js"
import {
	MetalCountdown
} from "../../components/countdown/metal-countdown.js"

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
	vimeoGovernor,
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
		profileMagistrate
	})

	const questions = createQuestionsModel({
		questionsBureau
	})

	const viewer = createVideoViewerModel({
		user,
		vimeoGovernor,
	})

	const schedule = createScheduleModel({
		user,
		scheduleSentry,
	})

	//
	// wire models to each other
	//

	user.reader.subscribe(paywall.receiveUserUpdate)
	user.reader.subscribe(profile.receiveUserUpdate)
	user.reader.subscribe(questions.receiveUserUpdate)
	profile.reader.subscribe(state => questions.updateProfile(state.profile))
	paywall.subscribeLoginWithAccessToken(user.receiveLoginWithAccessToken)

	paywall.receiveUserUpdate(user.reader.state)
	profile.receiveUserUpdate(user.reader.state)
	questions.receiveUserUpdate(user.reader.state)
	questions.updateProfile(profile.reader.state.profile)

	//
	// give back components and high level start function
	//

	return {
		components: {
			MetalAvatar,
			MetalAccount: provideModel(user, MetalAccount),
			MetalMyAvatar: provideModel(profile, MetalMyAvatar),
			MetalLiveshow: provideModel(viewer, MetalLiveshow),
			MetalProfile: provideModel(profile, MetalProfile),
			MetalPaywall: provideModel(paywall, MetalPaywall),
			MetalQuestions: provideModel(questions, MetalQuestions),
			MetalCountdown: provideModel(schedule, MetalCountdown),
		},
		async start() {
			return user.start()
		}
	}
}
