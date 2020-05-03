
import {share} from "../../framework/share.js"
import {Supermodel, AccountShare, CountdownShare, PaywallShare, LiveshowShare, MyAvatarShare, AdminModeShare, AdminOnlyShare, QuestionsShare, DetailsShare} from "../../interfaces.js"

import {IronLoading} from "../../components/iron-loading.js"
import {MetalAvatar} from "../../components/metal-avatar.js"
import {MetalAccount} from "../../components/metal-account.js"
import {MetalPaywall} from "../../components/metal-paywall.js"
import {MetalLiveshow} from "../../components/metal-liveshow.js"
import {MetalMyAvatar} from "../../components/metal-my-avatar.js"
import {MetalAdminMode} from "../../components/metal-admin-mode.js"
import {MetalAdminOnly} from "../../components/metal-admin-only.js"
import {MetalProfile} from "../../components/details/metal-profile.js"
import {MetalSettings} from "../../components/details/metal-settings.js"
import {MetalCountdown} from "../../components/countdown/metal-countdown.js"
import {MetalQuestions} from "../../components/questions/metal-questions.js"

export const wireComponents = (supermodel: Supermodel) => {
	const detailsShare = () => <DetailsShare>{
		user: supermodel.auth.user,
		saveProfile: supermodel.details.saveProfile,
		profileLoad: supermodel.details.profileLoad,
		settingsLoad: supermodel.details.settingsLoad,
	}
	return {
		IronLoading,
		MetalAvatar,
		MetalAccount: share(MetalAccount, () => (<AccountShare>{
			user: supermodel.auth.user,
			mode: supermodel.auth.mode,
			getAuthContext: supermodel.auth.getAuthContext,
			login: supermodel.auth.login,
			logout: supermodel.auth.logout,
		})),
		MetalProfile: share(MetalProfile, detailsShare),
		MetalSettings: share(MetalSettings, detailsShare),
		MetalCountdown: share(MetalCountdown, () => (<CountdownShare>{
			user: supermodel.auth.user,
			events: supermodel.schedule.events,
			profile: supermodel.details.profile,
			loadEvent: supermodel.schedule.loadEvent,
			saveEvent: supermodel.schedule.saveEvent,
		})),
		MetalPaywall: share(MetalPaywall, () => (<PaywallShare>{
			user: supermodel.auth.user,
			authMode: supermodel.auth.mode,
			profile: supermodel.details.profile,
			// autoRenew: supermodel.paywall.autoRenew,
			// premiumStatus: supermodel.paywall.premiumStatus,
			// billingStatus: supermodel.paywall.billingStatus,
			// linkCard: supermodel.paywall.linkCard,
			// unlinkCard: supermodel.paywall.unlinkCard,
			// premiumSubscribe: supermodel.paywall.premiumSubscribe,
			// premiumSetAutoRenew: supermodel.paywall.premiumSetAutoRenew,
		})),
		MetalLiveshow: share(MetalLiveshow, () => (<LiveshowShare>{
			user: supermodel.auth.user,
			authMode: supermodel.auth.mode,
			getAuthContext: supermodel.auth.getAuthContext,
			makeViewModel: supermodel.liveshow.makeViewModel,
		})),
		MetalMyAvatar: share(MetalMyAvatar, () => (<MyAvatarShare>{
			profile: supermodel.details.profile,
			premiumStatus: supermodel.paywall.premiumStatus,
		})),
		MetalAdminMode: share(MetalAdminMode, () => (<AdminModeShare>{
			user: supermodel.auth.user,
			settingsLoad: supermodel.details.settingsLoad,
			setAdminMode: () => { throw new Error("TODO implement") },
		})),
		MetalAdminOnly: share(MetalAdminOnly, () => (<AdminOnlyShare>{
			user: supermodel.auth.user,
			settingsLoad: supermodel.details.settingsLoad,
		})),
		MetalQuestions: share(MetalQuestions, () => (<QuestionsShare>{
			user: supermodel.auth.user,
			profile: supermodel.details.profile,
			uiBureau: supermodel.questions.uiBureau,
			fetchCachedQuestions: supermodel.questions.fetchCachedQuestions,
		})),
	}
}
