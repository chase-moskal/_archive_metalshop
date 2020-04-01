
import {share} from "../../framework/share.js"
import {AccountShare, ProfileShare, Supermodel} from "../../interfaces.js"

import {MetalAvatar} from "../../components/metal-avatar.js"
import {MetalAccount} from "../../components/metal-account.js"
import {MetalProfile} from "../../components/metal-profile.js"
// import {MetalPaywall} from "../../components/metal-paywall.js"
// import {MetalLiveshow} from "../../components/metal-liveshow.js"
// import {MetalMyAvatar} from "../../components/metal-my-avatar.js"
// import {MetalAdminMode} from "../../components/metal-admin-mode.js"
// import {MetalAdminOnly} from "../../components/metal-admin-only.js"
// import {MetalCountdown} from "../../components/countdown/metal-countdown.js"
// import {MetalQuestions} from "../../components/questions/metal-questions.js"

export const prepareComponents = (supermodel: Supermodel) => ({
	MetalAvatar,
	MetalAccount: share(MetalAccount, () => <AccountShare>({
		mode: supermodel.auth.mode,
		getAuthContext: supermodel.auth.getAuthContext,
	})),
	MetalProfile: share(MetalProfile, () => <ProfileShare>({
		mode: supermodel.profile.mode,
		profile: supermodel.profile.profile,
		displayAdminFeatures: supermodel.profile.displayAdminFeatures,
		saveProfile: supermodel.profile.saveProfile,
		loadProfile: supermodel.profile.loadProfile,
	}))
	// MetalPaywall: provideModel(paywall, MetalPaywall),
	// MetalProfile: provideModel(profile, MetalProfile),
	// MetalLiveshow: provideModel(viewer, MetalLiveshow),
	// MetalMyAvatar: provideModel(profile, MetalMyAvatar),
	// MetalAdminMode: provideModel(profile, MetalAdminMode),
	// MetalAdminOnly: provideModel(profile, MetalAdminOnly),
	// MetalCountdown: provideModel(schedule, MetalCountdown),
	// MetalQuestions: provideModel(questions, MetalQuestions),
})
