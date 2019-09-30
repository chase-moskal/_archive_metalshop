import { MetalOptions } from "./interfaces.js";
export declare function installMetalshop(options?: MetalOptions): Promise<{
    start: () => Promise<void>;
    components: {
        IronLoading: typeof import("./components/iron-loading.js").IronLoading;
        MetalAvatar: typeof import("./components/metal-avatar.js").MetalAvatar;
        MetalAccount: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").AccountShare;
            };
        } & typeof import("./components/metal-account.js").MetalAccount;
        MetalIsPremium: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").AccountShare;
            };
        } & typeof import("./components/metal-is-premium.js").MetalIsPremium;
        MetalButtonAuth: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").AccountShare;
            };
        } & typeof import("./components/metal-button-auth.js").MetalButtonAuth;
        MetalIsLoggedin: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").AccountShare;
            };
        } & typeof import("./components/metal-is-loggedin.js").MetalIsLoggedin;
        MetalProfile: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").ProfileShare;
            };
        } & typeof import("./components/metal-profile.js").MetalProfile;
        MetalSettings: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").SettingsShare;
            };
        } & typeof import("./components/metal-settings.js").MetalSettings;
        MetalCountdown: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").CountdownShare;
            };
        } & typeof import("./components/metal-countdown.js").MetalCountdown;
        MetalPaywall: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").PaywallShare;
            };
        } & typeof import("./components/metal-paywall.js").MetalPaywall;
        MetalButtonPremium: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").ButtonPremiumShare;
            };
        } & typeof import("./components/metal-button-premium.js").MetalButtonPremium;
        MetalLiveshow: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").LiveshowShare;
            };
        } & typeof import("./components/metal-liveshow.js").MetalLiveshow;
        MetalMyAvatar: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").MyAvatarShare;
            };
        } & typeof import("./components/metal-my-avatar.js").MetalMyAvatar;
        MetalAdminMode: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").AdminModeShare;
            };
        } & typeof import("./components/metal-admin-mode.js").MetalAdminMode;
        MetalIsAdmin: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").AdminOnlyShare;
            };
        } & typeof import("./components/metal-is-admin.js").MetalIsAdmin;
        MetalQuestions: {
            new (...args: any[]): {
                readonly share: import("./interfaces.js").QuestionsShare;
            };
        } & typeof import("./components/metal-questions.js").MetalQuestions;
    };
    supermodel: import("./interfaces.js").Supermodel;
}>;
