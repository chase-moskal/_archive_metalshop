
import {autorun} from "mobx"
import {MetalOptions, Supermodel} from "../../interfaces.js"

import {AuthModel} from "../../models/auth-model.js"
import {PaywallModel} from "../../models/paywall-model.js"
import {DetailsModel} from "../../models/details-model.js"
import {LiveshowModel} from "../../models/liveshow-model.js"
import {ScheduleModel} from "../../models/schedule-model.js"
import {QuestionsModel} from "../../models/questions-model.js"

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
	checkoutPopupUrl,
	decodeAccessToken,
	triggerAccountPopup,
	triggerCheckoutPopup,
}: MetalOptions): Supermodel {

	const auth = new AuthModel({
		tokenStore,
		decodeAccessToken,
		triggerAccountPopup,
		expiryGraceSeconds: 60
	})

	const details = new DetailsModel({logger, profileMagistrate, settingsSheriff})

	const supermodel = {
		auth,
		details,
		paywall: new PaywallModel({
			auth,
			details,
			paywallLiaison,
			checkoutPopupUrl,
			triggerCheckoutPopup,
		}),
		questions: new QuestionsModel({questionsBureau}),
		liveshow: new LiveshowModel({liveshowGovernor}),
		schedule: new ScheduleModel({scheduleSentry}),
	}

	autorun(() => {
		const {authLoad} = supermodel.auth
		supermodel.details.handleAuthLoad(authLoad)
		supermodel.liveshow.handleAuthLoad(authLoad)
		supermodel.schedule.handleAuthLoad(authLoad)
		supermodel.questions.handleAuthLoad(authLoad)
	})

	autorun(() => {
		const {profile} = supermodel.details
		supermodel.questions.handleProfileUpdate(profile)
	})

	return supermodel
}
