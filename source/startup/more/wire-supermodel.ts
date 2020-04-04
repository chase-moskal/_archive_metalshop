
import {autorun} from "mobx"

import {AuthModel} from "../../models/auth-model.js"
import {ProfileModel} from "../../models/profile-model.js"
import {PaywallModel} from "../../models/paywall-model.js"
import {LiveshowModel} from "../../models/liveshow-model.js"
import {ScheduleModel} from "../../models/schedule-model.js"
import {QuestionsModel} from "../../models/questions-model.js"
import {MetalOptions, Supermodel, AuthUpdate} from "../../interfaces.js"

export function wireSupermodel({
	tokenStorage,
	scheduleSentry,
	paywallGuardian,
	questionsBureau,
	liveshowGovernor,
	profileMagistrate,
	//—
	loginPopupRoutine,
	decodeAccessToken,
}: MetalOptions): Supermodel {

	const supermodel = {
		auth: new AuthModel({
			tokenStorage,
			loginPopupRoutine,
			decodeAccessToken,
			expiryGraceSeconds: 60
		}),
		profile: new ProfileModel({profileMagistrate}),
		paywall: new PaywallModel({paywallGuardian}),
		questions: new QuestionsModel({questionsBureau}),
		liveshow: new LiveshowModel({liveshowGovernor}),
		schedule: new ScheduleModel({scheduleSentry}),
	}

	// auth updates
	autorun(() => {
		const {user, mode, getAuthContext} = supermodel.auth
		const update: AuthUpdate = {user, mode, getAuthContext}
		supermodel.profile.handleAuthUpdate(update)
		supermodel.paywall.handleAuthUpdate(update)
		supermodel.liveshow.handleAuthUpdate(update)
		supermodel.questions.handleAuthUpdate(update)
	})

	// paywall updates
	autorun(() => {
		const {newAccessToken} = supermodel.paywall
		supermodel.auth.loginWithAccessToken(newAccessToken)
	})

	// profile updates
	autorun(() => {
		const {profile} = supermodel.profile
		supermodel.questions.handleProfileUpdate(profile)
	})

	return supermodel
}
