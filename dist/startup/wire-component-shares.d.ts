import { ButtonPremiumShare, SettingsShare, ProfileShare, MyAvatarShare, AdminModeShare, AdminOnlyShare, QuestionsShare, Supermodel, AccountShare, CountdownShare, PaywallShare, LiveshowShare } from "../interfaces.js";
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
export declare const wireComponentShares: (supermodel: Supermodel) => {
    IronLoading: typeof IronLoading;
    MetalAvatar: typeof MetalAvatar;
    MetalAccount: {
        new (...args: any[]): {
            readonly share: AccountShare;
        };
    } & typeof MetalAccount;
    MetalIsPremium: {
        new (...args: any[]): {
            readonly share: AccountShare;
        };
    } & typeof MetalIsPremium;
    MetalButtonAuth: {
        new (...args: any[]): {
            readonly share: AccountShare;
        };
    } & typeof MetalButtonAuth;
    MetalIsLoggedin: {
        new (...args: any[]): {
            readonly share: AccountShare;
        };
    } & typeof MetalIsLoggedin;
    MetalProfile: {
        new (...args: any[]): {
            readonly share: ProfileShare;
        };
    } & typeof MetalProfile;
    MetalSettings: {
        new (...args: any[]): {
            readonly share: SettingsShare;
        };
    } & typeof MetalSettings;
    MetalCountdown: {
        new (...args: any[]): {
            readonly share: CountdownShare;
        };
    } & typeof MetalCountdown;
    MetalPaywall: {
        new (...args: any[]): {
            readonly share: PaywallShare;
        };
    } & typeof MetalPaywall;
    MetalButtonPremium: {
        new (...args: any[]): {
            readonly share: ButtonPremiumShare;
        };
    } & typeof MetalButtonPremium;
    MetalLiveshow: {
        new (...args: any[]): {
            readonly share: LiveshowShare;
        };
    } & typeof MetalLiveshow;
    MetalMyAvatar: {
        new (...args: any[]): {
            readonly share: MyAvatarShare;
        };
    } & typeof MetalMyAvatar;
    MetalAdminMode: {
        new (...args: any[]): {
            readonly share: AdminModeShare;
        };
    } & typeof MetalAdminMode;
    MetalIsAdmin: {
        new (...args: any[]): {
            readonly share: AdminOnlyShare;
        };
    } & typeof MetalIsAdmin;
    MetalQuestions: {
        new (...args: any[]): {
            readonly share: QuestionsShare;
        };
    } & typeof MetalQuestions;
};
