import { PaywallLiaisonTopic } from "authoritarian/dist/interfaces.js";
import { AuthModel } from "./auth-model.js";
import { ProfileModel } from "./profile-model.js";
import { SettingsModel } from "./settings-model.js";
import { TriggerCheckoutPopup } from "../interfaces.js";
export declare class PaywallModel {
    private readonly auth;
    private readonly profile;
    private readonly settings;
    private readonly checkoutPopupUrl;
    private readonly paywallLiaison;
    private readonly triggerCheckoutPopup;
    constructor(options: {
        auth: AuthModel;
        profile: ProfileModel;
        settings: SettingsModel;
        checkoutPopupUrl: string;
        paywallLiaison: PaywallLiaisonTopic;
        triggerCheckoutPopup: TriggerCheckoutPopup;
    });
    get premiumClaim(): boolean;
    get premiumExpires(): number;
    get premiumSubscription(): {
        card: import("authoritarian/dist/interfaces").CardClues;
    };
    checkoutPremium(): Promise<void>;
    updatePremium(): Promise<void>;
    cancelPremium(): Promise<void>;
}
