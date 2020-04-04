
import {share} from "../../framework/share.js"
import {Supermodel, AccountShare, ProfileShare, CountdownShare, PaywallShare, LiveshowShare, MyAvatarShare, AdminModeShare, AdminOnlyShare, QuestionsShare} from "../../interfaces.js"

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

export const wireComponents = (supermodel: Supermodel) => ({
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
		mode: supermodel.profile.mode,
		profile: supermodel.profile.profile,
		saveProfile: supermodel.profile.saveProfile,
		loadProfile: supermodel.profile.loadProfile,
		getAuthContext: supermodel.auth.getAuthContext,
		displayAdminFeatures: supermodel.profile.displayAdminFeatures,
	})),
	MetalCountdown: share(MetalCountdown, () => (<CountdownShare>{
		user: supermodel.auth.user,
		profile: supermodel.profile.profile,
		events: supermodel.schedule.events,
		loadEvent: supermodel.schedule.loadEvent,
		saveEvent: supermodel.schedule.saveEvent,
	})),
	MetalPaywall: share(MetalPaywall, () => (<PaywallShare>{
		user: supermodel.auth.user,
		mode: supermodel.paywall.mode,
		profile: supermodel.profile.profile,
		grantUserPremium: supermodel.paywall.grantUserPremium,
		revokeUserPremium: supermodel.paywall.revokeUserPremium,
	})),
	MetalLiveshow: share(MetalLiveshow, () => (<LiveshowShare>{
		user: supermodel.auth.user,
		authMode: supermodel.auth.mode,
		getAuthContext: supermodel.auth.getAuthContext,
		makeViewModel: supermodel.liveshow.makeViewModel,
	})),
	MetalMyAvatar: share(MetalMyAvatar, () => (<MyAvatarShare>{
		profile: supermodel.profile.profile,
		paywallMode: supermodel.paywall.mode,
	})),
	MetalAdminMode: share(MetalAdminMode, () => (<AdminModeShare>{
		user: supermodel.auth.user,
		profile: supermodel.profile.profile,
		profileMode: supermodel.profile.mode,
		saveProfile: supermodel.profile.saveProfile,
	})),
	MetalAdminOnly: share(MetalAdminOnly, () => (<AdminOnlyShare>{
		user: supermodel.auth.user,
		profile: supermodel.profile.profile,
		profileMode: supermodel.profile.mode,
	})),
	MetalQuestions: share(MetalQuestions, () => (<QuestionsShare>{
		user: supermodel.auth.user,
		profile: supermodel.profile.profile,
		uiBureau: supermodel.questions.uiBureau,
		fetchCachedQuestions: supermodel.questions.fetchCachedQuestions,
	})),
})
