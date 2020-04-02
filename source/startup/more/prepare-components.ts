
import {share} from "../../framework/share.js"
import {Supermodel, AccountShare, ProfileShare, CountdownShare} from "../../interfaces.js"

import {MetalAvatar} from "../../components/metal-avatar.js"
import {MetalAccount} from "../../components/metal-account.js"
import {MetalProfile} from "../../components/metal-profile.js"
import {MetalCountdown} from "../../components/countdown/metal-countdown.js"
// import {MetalPaywall} from "../../components/metal-paywall.js"
// import {MetalLiveshow} from "../../components/metal-liveshow.js"
// import {MetalMyAvatar} from "../../components/metal-my-avatar.js"
// import {MetalAdminMode} from "../../components/metal-admin-mode.js"
// import {MetalAdminOnly} from "../../components/metal-admin-only.js"
// import {MetalQuestions} from "../../components/questions/metal-questions.js"

export const prepareComponents = (supermodel: Supermodel) => ({
	MetalAvatar,
	MetalAccount: share(MetalAccount, () => (<AccountShare>{
		user: supermodel.auth.user,
		mode: supermodel.auth.mode,
		getAuthContext: supermodel.auth.getAuthContext,
		login: supermodel.auth.login,
		logout: supermodel.auth.logout,
	})),
	MetalProfile: share(MetalProfile, () => (<ProfileShare>{
		user: supermodel.auth.user,
		getAuthContext: supermodel.auth.getAuthContext,
		mode: supermodel.profile.mode,
		profile: supermodel.profile.profile,
		displayAdminFeatures: supermodel.profile.displayAdminFeatures,
		saveProfile: supermodel.profile.saveProfile,
		loadProfile: supermodel.profile.loadProfile,
	})),
	MetalCountdown: share(MetalCountdown, () => (<CountdownShare>{
		user: supermodel.auth.user,
		profile: supermodel.profile.profile,
		events: supermodel.schedule.events,
		loadEvent: supermodel.schedule.loadEvent,
		saveEvent: supermodel.schedule.saveEvent,
	})),
	// MetalPaywall: provideModel(paywall, MetalPaywall),
	// MetalProfile: provideModel(profile, MetalProfile),
	// MetalLiveshow: provideModel(viewer, MetalLiveshow),
	// MetalMyAvatar: provideModel(profile, MetalMyAvatar),
	// MetalAdminMode: provideModel(profile, MetalAdminMode),
	// MetalAdminOnly: provideModel(profile, MetalAdminOnly),
	// MetalQuestions: provideModel(questions, MetalQuestions),
})
