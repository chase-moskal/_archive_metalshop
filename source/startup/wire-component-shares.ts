
import {share} from "../framework/share.js"
import {
	Supermodel, AccountShare, CountdownShare, PaywallShare, LiveshowShare,
	MyAvatarShare, AdminModeShare, AdminOnlyShare, QuestionsShare, DetailsShare,
	ButtonPremiumShare,
} from "../interfaces.js"

import {IronLoading} from "../components/iron-loading.js"
import {MetalAvatar} from "../components/metal-avatar.js"
import {MetalAccount} from "../components/metal-account.js"
import {MetalPaywall} from "../components/metal-paywall.js"
import {MetalProfile} from "../components/metal-profile.js"
import {MetalIsAdmin} from "../components/metal-is-admin.js"
import {MetalLiveshow} from "../components/metal-liveshow.js"
import {MetalSettings} from "../components/metal-settings.js"
import {MetalMyAvatar} from "../components/metal-my-avatar.js"
import {MetalCountdown} from "../components/metal-countdown.js"
import {MetalQuestions} from "../components/metal-questions.js"
import {MetalAdminMode} from "../components/metal-admin-mode.js"
import {MetalIsPremium} from "../components/metal-is-premium.js"
import {MetalButtonAuth} from "../components/metal-button-auth.js"
import {MetalIsLoggedin} from "../components/metal-is-loggedin.js"
import {MetalButtonPremium} from "../components/metal-button-premium.js"

export const wireComponentShares = (supermodel: Supermodel) => {
	const detailsShare = (): DetailsShare => ({
		user: supermodel.auth.user,
		authLoad: supermodel.auth.authLoad,
		profile: supermodel.details.profile,
		settings: supermodel.details.settings,
		profileLoad: supermodel.details.profileLoad,
		saveProfile: supermodel.details.saveProfile,
		settingsLoad: supermodel.details.settingsLoad,
	})
	const accountShare = (): AccountShare => ({
		login: supermodel.auth.login,
		logout: supermodel.auth.logout,
		authLoad: supermodel.auth.authLoad,
	})
	const paywallShare = (): PaywallShare => ({
		authLoad: supermodel.auth.authLoad,
		settingsLoad: supermodel.details.settingsLoad,
		premiumClaim: supermodel.paywall.premiumClaim,
		premiumExpires: supermodel.paywall.premiumExpires,
		premiumSubscription: supermodel.paywall.premiumSubscription,
		updatePremium: supermodel.paywall.updatePremium,
		cancelPremium: supermodel.paywall.cancelPremium,
		checkoutPremium: supermodel.paywall.checkoutPremium,
	})
	return {
		IronLoading,
		MetalAvatar,
		MetalAccount: share(MetalAccount, accountShare),
		MetalIsPremium: share(MetalIsPremium, accountShare),
		MetalButtonAuth: share(MetalButtonAuth, accountShare),
		MetalIsLoggedin: share(MetalIsLoggedin, accountShare),
		MetalProfile: share(MetalProfile, detailsShare),
		MetalSettings: share(MetalSettings, detailsShare),
		MetalCountdown: share(MetalCountdown, (): CountdownShare => ({
			events: supermodel.schedule.events,
			authLoad: supermodel.auth.authLoad,
			profileLoad: supermodel.details.profileLoad,
			loadEvent: supermodel.schedule.loadEvent,
			saveEvent: supermodel.schedule.saveEvent,
		})),
		MetalPaywall: share(MetalPaywall, paywallShare),
		MetalButtonPremium: share(MetalButtonPremium, (): ButtonPremiumShare => ({
			authLoad: supermodel.auth.authLoad,
			login: supermodel.auth.login,
			checkoutPremium: supermodel.paywall.checkoutPremium,
			premiumClaim: supermodel.paywall.premiumClaim,
			premiumSubscription: supermodel.paywall.premiumSubscription,
		})),
		MetalLiveshow: share(MetalLiveshow, (): LiveshowShare => ({
			authLoad: supermodel.auth.authLoad,
			makeViewModel: supermodel.liveshow.makeViewModel,
		})),
		MetalMyAvatar: share(MetalMyAvatar, (): MyAvatarShare => ({
			profile: supermodel.details.profile,
			premium: supermodel.paywall.premiumClaim,
		})),
		MetalAdminMode: share(MetalAdminMode, (): AdminModeShare => ({
			authLoad: supermodel.auth.authLoad,
			settingsLoad: supermodel.details.settingsLoad,
			setAdminMode: supermodel.details.setAdminMode,
		})),
		MetalIsAdmin: share(MetalIsAdmin, (): AdminOnlyShare => ({
			authLoad: supermodel.auth.authLoad,
			settingsLoad: supermodel.details.settingsLoad,
		})),
		MetalQuestions: share(MetalQuestions, (): QuestionsShare => ({
			user: supermodel.auth.user,
			profile: supermodel.details.profile,
			uiBureau: supermodel.questions.uiBureau,
			fetchCachedQuestions: supermodel.questions.fetchCachedQuestions,
		})),
	}
}
