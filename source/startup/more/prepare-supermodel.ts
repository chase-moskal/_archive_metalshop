
import {autorun} from "mobx"

import {AuthModel} from "../../models/auth-model.js"
import {PaywallModel} from "../../models/paywall-model.js"
import {DetailsModel} from "../../models/details-model.js"
import {LiveshowModel} from "../../models/liveshow-model.js"
import {ScheduleModel} from "../../models/schedule-model.js"
import {QuestionsModel} from "../../models/questions-model.js"
import {MetalOptions, Supermodel, AuthUpdate} from "../../interfaces.js"

export function prepareSupermodel({
	logger,
	tokenStore,
	paywallLiaison,
	scheduleSentry,
	settingsSheriff,
	questionsBureau,
	liveshowGovernor,
	profileMagistrate,
	//—
	decodeAccessToken,
	triggerAccountPopup,
	triggerCheckoutPopup,
}: MetalOptions): Supermodel {

	const supermodel = {
		auth: new AuthModel({
			tokenStore,
			triggerAccountPopup,
			decodeAccessToken,
			expiryGraceSeconds: 60
		}),
		details: new DetailsModel({logger, profileMagistrate, settingsSheriff}),
		paywall: new PaywallModel({
			paywallLiaison,
			triggerCheckoutPopup,
		}),
		questions: new QuestionsModel({questionsBureau}),
		liveshow: new LiveshowModel({liveshowGovernor}),
		schedule: new ScheduleModel({scheduleSentry}),
	}

	// auth updates
	autorun(() => {
		const {user, mode, getAuthContext} = supermodel.auth
		const update: AuthUpdate = {user, mode, getAuthContext}
		supermodel.details.handleAuthUpdate(update)
		supermodel.paywall.handleAuthUpdate(update)
		supermodel.liveshow.handleAuthUpdate(update)
		supermodel.schedule.handleAuthUpdate(update)
		supermodel.questions.handleAuthUpdate(update)
	})

	// TODO reconsider
	// // paywall updates
	// autorun(() => {
	// 	const {newAccessToken} = supermodel.paywall
	// 	supermodel.auth.loginWithAccessToken(newAccessToken)
	// })
	// // profile updates
	// autorun(() => {
	// 	const {profile} = supermodel.profile
	// 	supermodel.questions.handleProfileUpdate(profile)
	// })

	return supermodel
}
