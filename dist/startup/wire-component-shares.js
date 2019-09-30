import { share } from "../framework/share.js";
import { IronLoading } from "../components/iron-loading.js";
import { MetalAvatar } from "../components/metal-avatar.js";
import { MetalAccount } from "../components/metal-account.js";
import { MetalPaywall } from "../components/metal-paywall.js";
import { MetalProfile } from "../components/metal-profile.js";
import { MetalIsAdmin } from "../components/metal-is-admin.js";
import { MetalLiveshow } from "../components/metal-liveshow.js";
import { MetalSettings } from "../components/metal-settings.js";
import { MetalMyAvatar } from "../components/metal-my-avatar.js";
import { MetalCountdown } from "../components/metal-countdown.js";
import { MetalQuestions } from "../components/metal-questions.js";
import { MetalAdminMode } from "../components/metal-admin-mode.js";
import { MetalIsPremium } from "../components/metal-is-premium.js";
import { MetalButtonAuth } from "../components/metal-button-auth.js";
import { MetalIsLoggedin } from "../components/metal-is-loggedin.js";
import { MetalButtonPremium } from "../components/metal-button-premium.js";
export const wireComponentShares = (supermodel) => {
    const accountShare = () => ({
        login: supermodel.auth.login,
        logout: supermodel.auth.logout,
        authLoad: supermodel.auth.authLoad,
    });
    return {
        IronLoading,
        MetalAvatar,
        MetalAccount: share(MetalAccount, accountShare),
        MetalIsPremium: share(MetalIsPremium, accountShare),
        MetalButtonAuth: share(MetalButtonAuth, accountShare),
        MetalIsLoggedin: share(MetalIsLoggedin, accountShare),
        MetalProfile: share(MetalProfile, () => ({
            user: supermodel.auth.user,
            authLoad: supermodel.auth.authLoad,
            profile: supermodel.profile.profile,
            profileLoad: supermodel.profile.profileLoad,
            saveProfile: supermodel.profile.saveProfile,
        })),
        MetalSettings: share(MetalSettings, () => ({
            user: supermodel.auth.user,
            authLoad: supermodel.auth.authLoad,
            settings: supermodel.settings.settings,
            settingsLoad: supermodel.settings.settingsLoad,
        })),
        MetalCountdown: share(MetalCountdown, () => ({
            events: supermodel.schedule.events,
            authLoad: supermodel.auth.authLoad,
            profileLoad: supermodel.profile.profileLoad,
            loadEvent: supermodel.schedule.loadEvent,
            saveEvent: supermodel.schedule.saveEvent,
        })),
        MetalPaywall: share(MetalPaywall, () => ({
            authLoad: supermodel.auth.authLoad,
            settingsLoad: supermodel.settings.settingsLoad,
            premiumClaim: supermodel.paywall.premiumClaim,
            premiumExpires: supermodel.paywall.premiumExpires,
            premiumSubscription: supermodel.paywall.premiumSubscription,
            updatePremium: supermodel.paywall.updatePremium,
            cancelPremium: supermodel.paywall.cancelPremium,
            checkoutPremium: supermodel.paywall.checkoutPremium,
        })),
        MetalButtonPremium: share(MetalButtonPremium, () => ({
            authLoad: supermodel.auth.authLoad,
            premiumClaim: supermodel.paywall.premiumClaim,
            settingsLoad: supermodel.settings.settingsLoad,
            premiumSubscription: supermodel.paywall.premiumSubscription,
            login: supermodel.auth.login,
            checkoutPremium: supermodel.paywall.checkoutPremium,
        })),
        MetalLiveshow: share(MetalLiveshow, () => ({
            authLoad: supermodel.auth.authLoad,
            makeViewModel: supermodel.liveshow.makeViewModel,
        })),
        MetalMyAvatar: share(MetalMyAvatar, () => ({
            profile: supermodel.profile.profile,
            premium: supermodel.paywall.premiumClaim,
        })),
        MetalAdminMode: share(MetalAdminMode, () => ({
            authLoad: supermodel.auth.authLoad,
            settingsLoad: supermodel.settings.settingsLoad,
            setAdminMode: supermodel.settings.setAdminMode,
        })),
        MetalIsAdmin: share(MetalIsAdmin, () => ({
            authLoad: supermodel.auth.authLoad,
            settingsLoad: supermodel.settings.settingsLoad,
        })),
        MetalQuestions: share(MetalQuestions, () => ({
            user: supermodel.auth.user,
            profile: supermodel.profile.profile,
            uiBureau: supermodel.questions.uiBureau,
            fetchCachedQuestions: supermodel.questions.fetchCachedQuestions,
        })),
    };
};
//# sourceMappingURL=wire-component-shares.js.map