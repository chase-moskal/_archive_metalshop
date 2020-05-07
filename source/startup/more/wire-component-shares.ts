
import {share} from "../../framework/share.js"
import {Supermodel, AccountShare, CountdownShare, PaywallShare, LiveshowShare, MyAvatarShare, AdminModeShare, AdminOnlyShare, QuestionsShare, DetailsShare} from "../../interfaces.js"

import {IronLoading} from "../../components/iron-loading.js"
import {MetalAvatar} from "../../components/metal-avatar.js"
import {MetalAccount} from "../../components/metal-account.js"
import {MetalPaywall} from "../../components/metal-paywall.js"
import {MetalProfile} from "../../components/metal-profile.js"
import {MetalLiveshow} from "../../components/metal-liveshow.js"
import {MetalSettings} from "../../components/metal-settings.js"
import {MetalMyAvatar} from "../../components/metal-my-avatar.js"
import {MetalAdminMode} from "../../components/metal-admin-mode.js"
import {MetalAdminOnly} from "../../components/metal-admin-only.js"
import {MetalCountdown} from "../../components/countdown/metal-countdown.js"
import {MetalQuestions} from "../../components/questions/metal-questions.js"

import * as loading from "../../toolbox/loading.js"

export const wireComponentShares = (supermodel: Supermodel) => {
	const detailsShare = () => <DetailsShare>{
		user: supermodel.auth.user,
		profile: supermodel.details.profile,
		settings: supermodel.details.settings,
		authLoad: supermodel.auth.authLoad,
		profileLoad: supermodel.details.profileLoad,
		settingsLoad: supermodel.details.settingsLoad,
		saveProfile: supermodel.details.saveProfile,
	}
	return {
		IronLoading,
		MetalAvatar,
		MetalAccount: share(MetalAccount, () => (<AccountShare>{
			login: supermodel.auth.login,
			logout: supermodel.auth.logout,
			authLoad: supermodel.auth.authLoad,
		})),
		MetalProfile: share(MetalProfile, detailsShare),
		MetalSettings: share(MetalSettings, detailsShare),
		MetalCountdown: share(MetalCountdown, () => (<CountdownShare>{
			events: supermodel.schedule.events,
			authLoad: supermodel.auth.authLoad,
			profileLoad: supermodel.details.profileLoad,
			loadEvent: supermodel.schedule.loadEvent,
			saveEvent: supermodel.schedule.saveEvent,
		})),
		MetalPaywall: share(MetalPaywall, () => (<PaywallShare>{
			authLoad: supermodel.auth.authLoad,
			premium: supermodel.paywall.premium,
			billingPremiumSubscription: supermodel.paywall.billingPremiumSubscription,
			checkoutPremium: supermodel.paywall.checkoutPremium,
			updatePremium: supermodel.paywall.updatePremium,
			cancelPremium: supermodel.paywall.cancelPremium,
			// autoRenew: supermodel.paywall.autoRenew,
			// premiumStatus: supermodel.paywall.premiumStatus,
			// billingStatus: supermodel.paywall.billingStatus,
			// linkCard: supermodel.paywall.linkCard,
			// unlinkCard: supermodel.paywall.unlinkCard,
			// premiumSubscribe: supermodel.paywall.premiumSubscribe,
			// premiumSetAutoRenew: supermodel.paywall.premiumSetAutoRenew,
		})),
		MetalLiveshow: share(MetalLiveshow, () => (<LiveshowShare>{
			authLoad: supermodel.auth.authLoad,
			makeViewModel: supermodel.liveshow.makeViewModel,
		})),
		MetalMyAvatar: share(MetalMyAvatar, () => (<MyAvatarShare>{
			profile: supermodel.details.profile,
			premium: supermodel.paywall.premium,
		})),
		MetalAdminMode: share(MetalAdminMode, () => (<AdminModeShare>{
			authLoad: supermodel.auth.authLoad,
			settingsLoad: supermodel.details.settingsLoad,
			setAdminMode: () => { throw new Error("TODO implement") },
		})),
		MetalAdminOnly: share(MetalAdminOnly, () => (<AdminOnlyShare>{
			authLoad: supermodel.auth.authLoad,
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
