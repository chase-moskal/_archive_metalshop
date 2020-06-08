
import {share} from "../framework/share.js"
import {
	ButtonPremiumShare, PersonalShare, SeekerShare,
	MyAvatarShare, AdminModeShare, AdminOnlyShare, QuestionsShare,
	Supermodel, AccountShare, CountdownShare, PaywallShare, LiveshowShare,
} from "../interfaces.js"

import {IronLoading} from "../components/iron-loading.js"
import {IronTextInput} from "../components/iron-text-input.js"

import {CobaltCard} from "../components/cobalt-card.js"
import {CobaltAvatar} from "../components/cobalt-avatar.js"

import {MetalAvatar} from "../components/metal-avatar.js"
import {MetalSeeker} from "../components/metal-seeker.js"
import {MetalAccount} from "../components/metal-account.js"
import {MetalPaywall} from "../components/metal-paywall.js"
import {MetalIsAdmin} from "../components/metal-is-admin.js"
import {MetalLiveshow} from "../components/metal-liveshow.js"
import {MetalPersonal} from "../components/metal-personal.js"
import {MetalMyAvatar} from "../components/metal-my-avatar.js"
import {MetalCountdown} from "../components/metal-countdown.js"
import {MetalQuestions} from "../components/metal-questions.js"
import {MetalAdminMode} from "../components/metal-admin-mode.js"
import {MetalIsPremium} from "../components/metal-is-premium.js"
import {MetalButtonAuth} from "../components/metal-button-auth.js"
import {MetalIsLoggedin} from "../components/metal-is-loggedin.js"
import {MetalButtonPremium} from "../components/metal-button-premium.js"

export const wireComponentShares = (supermodel: Supermodel) => {
	const accountShare = (): AccountShare => ({
		login: supermodel.auth.login,
		logout: supermodel.auth.logout,
		authLoad: supermodel.auth.authLoad,
	})
	return {
		IronLoading,
		IronTextInput,

		CobaltCard,
		CobaltAvatar,

		MetalAvatar,
		MetalAccount: share(MetalAccount, accountShare),
		MetalIsPremium: share(MetalIsPremium, accountShare),
		MetalButtonAuth: share(MetalButtonAuth, accountShare),
		MetalIsLoggedin: share(MetalIsLoggedin, accountShare),
		MetalPersonal: share(MetalPersonal, (): PersonalShare => ({
			personal: supermodel.personal.personal,
			personalLoad: supermodel.personal.personalLoad,
			saveProfile: supermodel.personal.saveProfile,
			setAdminMode: supermodel.personal.setAdminMode,
			setAvatarPublicity: supermodel.personal.setAvatarPublicity,
		})),
		MetalSeeker: share(MetalSeeker, (): SeekerShare => ({
			query: supermodel.seeker.query,
			resultsLoad: supermodel.seeker.resultsLoad,
		})),
		MetalCountdown: share(MetalCountdown, (): CountdownShare => ({
			events: supermodel.schedule.events,
			authLoad: supermodel.auth.authLoad,
			loadEvent: supermodel.schedule.loadEvent,
			saveEvent: supermodel.schedule.saveEvent,
		})),
		MetalPaywall: share(MetalPaywall, (): PaywallShare => ({
			personalLoad: supermodel.personal.personalLoad,
			premiumClaim: supermodel.paywall.premiumClaim,
			premiumExpires: supermodel.paywall.premiumExpires,
			premiumSubscription: supermodel.paywall.premiumSubscription,
			updatePremium: supermodel.paywall.updatePremium,
			cancelPremium: supermodel.paywall.cancelPremium,
			checkoutPremium: supermodel.paywall.checkoutPremium,
		})),
		MetalButtonPremium: share(MetalButtonPremium, (): ButtonPremiumShare => ({
			personalLoad: supermodel.personal.personalLoad,
			premiumClaim: supermodel.paywall.premiumClaim,
			premiumSubscription: supermodel.paywall.premiumSubscription,
			login: supermodel.auth.login,
			checkoutPremium: supermodel.paywall.checkoutPremium,
		})),
		MetalLiveshow: share(MetalLiveshow, (): LiveshowShare => ({
			authLoad: supermodel.auth.authLoad,
			makeViewModel: supermodel.liveshow.makeViewModel,
		})),
		MetalMyAvatar: share(MetalMyAvatar, (): MyAvatarShare => ({
			personalLoad: supermodel.personal.personalLoad,
		})),
		MetalAdminMode: share(MetalAdminMode, (): AdminModeShare => ({
			personalLoad: supermodel.personal.personalLoad,
			setAdminMode: supermodel.personal.setAdminMode,
		})),
		MetalIsAdmin: share(MetalIsAdmin, (): AdminOnlyShare => ({
			personalLoad: supermodel.personal.personalLoad,
		})),
		MetalQuestions: share(MetalQuestions, (): QuestionsShare => ({
			user: supermodel.auth.user,
			profile: supermodel.personal.profile,
			uiBureau: supermodel.questions.uiBureau,
			fetchCachedQuestions: supermodel.questions.fetchCachedQuestions,
		})),
	}
}
