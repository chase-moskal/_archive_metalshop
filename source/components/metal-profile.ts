
import {select} from "../toolbox/selects.js"
import {DetailsShare} from "../interfaces.js"
import {styles} from "./styles/details-styles.js"
import {makeDebouncer} from "../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../toolbox/deep.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {Profile, Claims} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

 @mixinStyles(styles)
export class MetalProfile extends MetalshopComponent<DetailsShare> {

	 @property({type: Object})
	private changedProfile: Profile = null

	private inputDebouncer = makeDebouncer({
		delay: 1000,
		action: () => this.handleInputChange()
	})

	render() {
		const {profileLoad, user, profile} = this.share
		const premium = user?.claims.premium
		return html`
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
		`
	}

	private renderClaimsList(claims?: Claims) {
		claims = claims || {}
		return html`
			<ul class="claims-list">
				${claims.admin
					? html`<li data-tag="admin">Admin</li>`
					: null}
				${claims.premium
					? html`<li data-tag="premium">Premium</li>`
					: null}
			</ul>
		`
	}

	private renderNicknameInput(profile: Profile) {
		return html`
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
		`
	}

	private renderSaveNicknameButton() {
		const showSaveButton = !!this.changedProfile
		return showSaveButton ? html`
			<button class="save" @click=${this.handleSaveClick}>
				Save
			</button>
		` : null
	}

	private handleInputChange = () => {
		const {profile} = this.share
		if (!profile) return
		const newProfile = this.generateNewProfileFromInputs()
		const changes = !deepEqual(profile, newProfile)
		this.changedProfile = changes ? newProfile : null
	}

	private handleSaveClick = async() => {
		const {changedProfile: _changedProfile} = this
		this.changedProfile = null
		await this.share.saveProfile(_changedProfile)
	}

	private generateNewProfileFromInputs(): Profile {
		const {profile} = this.share
		const clonedProfile = deepClone(profile)
		const input = select<HTMLInputElement>(
			"input[name=nickname]",
			this.shadowRoot,
		)
		clonedProfile.nickname = input.value
		return clonedProfile
	}
}
