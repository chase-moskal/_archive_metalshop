var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { select } from "../toolbox/selects.js";
import { styles } from "./styles/details-styles.js";
import { makeDebouncer } from "../toolbox/debouncer.js";
import { deepClone, deepEqual } from "../toolbox/deep.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { MetalshopComponent, property, html } from "../framework/metalshop-component.js";
let MetalProfile = class MetalProfile extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.changedProfile = null;
        this.inputDebouncer = makeDebouncer({
            delay: 1000,
            action: () => this.handleInputChange()
        });
        this.handleInputChange = () => {
            const { profile } = this.share;
            if (!profile)
                return;
            const newProfile = this.generateNewProfileFromInputs();
            const changes = !deepEqual(profile, newProfile);
            this.changedProfile = changes ? newProfile : null;
        };
        this.handleSaveClick = async () => {
            const { changedProfile: _changedProfile } = this;
            this.changedProfile = null;
            await this.share.saveProfile(_changedProfile);
        };
    }
    render() {
        const { profileLoad, user, profile } = this.share;
        const premium = user?.claims.premium;
        return html `
			<iron-loading .load=${profileLoad}>
				<div class="container formarea coolbuttonarea">
					<metal-avatar
						src=${profile?.avatar || ""}
						?premium=${premium}
					></metal-avatar>
					<div>
						${this.renderClaimsList(user?.claims)}
						${this.renderNicknameInput(profile)}
						${this.renderSaveNicknameButton()}
					</div>
				</div>
			</iron-loading>
		`;
    }
    renderClaimsList(claims) {
        claims = claims || {};
        return html `
			<ul class="claims-list">
				${claims.admin
            ? html `<li data-tag="admin">Admin</li>`
            : null}
				${claims.premium
            ? html `<li data-tag="premium">Premium</li>`
            : null}
			</ul>
		`;
    }
    renderNicknameInput(profile) {
        return html `
			<input
				type="text"
				name="nickname"
				spellcheck="false"
				autocomplete="off"
				placeholder="nickname"
				@change=${this.handleInputChange}
				@keyup=${this.inputDebouncer.queue}
				.value=${profile?.nickname}
				/>
		`;
    }
    renderSaveNicknameButton() {
        const showSaveButton = !!this.changedProfile;
        return showSaveButton ? html `
			<button class="save" @click=${this.handleSaveClick}>
				Save
			</button>
		` : null;
    }
    generateNewProfileFromInputs() {
        const { profile } = this.share;
        const clonedProfile = deepClone(profile);
        const input = select("input[name=nickname]", this.shadowRoot);
        clonedProfile.nickname = input.value;
        return clonedProfile;
    }
};
__decorate([
    property({ type: Object })
], MetalProfile.prototype, "changedProfile", void 0);
MetalProfile = __decorate([
    mixinStyles(styles)
], MetalProfile);
export { MetalProfile };
//# sourceMappingURL=metal-profile.js.map