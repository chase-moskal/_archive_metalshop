
import {autorun} from "mobx"
import {MetalOptions, Supermodel} from "../interfaces.js"

import {AuthModel} from "../models/auth-model.js"
import {PaywallModel} from "../models/paywall-model.js"
import {ProfileModel} from "../models/profile-model.js"
import {LiveshowModel} from "../models/liveshow-model.js"
import {ScheduleModel} from "../models/schedule-model.js"
import {SettingsModel} from "../models/settings-model.js"
import {PersonalModel} from "../models/personal-model.js"
import {QuestionsModel} from "../models/questions-model.js"

export function assembleSupermodel({
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
	const personal = new PersonalModel({logger, profileMagistrate, settingsSheriff})
	const supermodel = {
		auth,
		personal,
		schedule: new ScheduleModel({scheduleSentry}),
		liveshow: new LiveshowModel({liveshowGovernor}),
		questions: new QuestionsModel({questionsBureau}),
	
		// TODO consider uncoupling inter-model dependencies
		paywall: new PaywallModel({
			auth,
			personal,
			paywallLiaison,
			checkoutPopupUrl,
			triggerCheckoutPopup,
		}),
	}

	autorun(() => {
		const {authLoad} = supermodel.auth
		supermodel.personal.handleAuthLoad(authLoad)
		supermodel.liveshow.handleAuthLoad(authLoad)
		supermodel.schedule.handleAuthLoad(authLoad)
		supermodel.questions.handleAuthLoad(authLoad)
	})

	autorun(() => {
		const {profile} = supermodel.personal
		supermodel.questions.handleProfileUpdate(profile)
	})

	return supermodel
}
