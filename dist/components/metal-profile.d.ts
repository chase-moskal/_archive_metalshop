import { ProfileShare } from "../interfaces.js";
import { MetalshopComponent } from "../framework/metalshop-component.js";
export declare class MetalProfile extends MetalshopComponent<ProfileShare> {
    private changedProfile;
    private inputDebouncer;
    render(): import("lit-html/lib/template-result").TemplateResult;
    private renderClaimsList;
    private renderNicknameInput;
    private renderSaveNicknameButton;
    private handleInputChange;
    private handleSaveClick;
    private generateNewProfileFromInputs;
}
