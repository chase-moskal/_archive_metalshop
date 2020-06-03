
import {PersonalShare} from "../interfaces.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "./styles/metal-personal-styles.js"
import {Profile} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html} from "../framework/metalshop-component.js"

 @mixinStyles(styles)
export class MetalPersonal extends MetalshopComponent<PersonalShare> {

	render() {
		const {personal, personalLoad} = this.share
		return html`
			<iron-loading
				.load=${personalLoad}
				class="container formarea coolbuttonarea">
					<cobalt-avatar .persona=${personal}></cobalt-avatar>
					<cobalt-card
						.persona=${personal}
						.saveProfile=${(profile: Profile) => {
							console.log("PROFILE LOL")
						}}
					></cobalt-card>
			</iron-loading>
		`
	}

	// @property({type: Object})
	// 	private changedProfile: Profile = null

	// private inputDebouncer = makeDebouncer({
	// 	delay: 1000,
	// 	action: () => this.handleInputChange()
	// })

	// private renderClaimsList(claims?: Claims) {
	// 	claims = claims || {}
	// 	return html`
	// 		<ul class="claims-list">
	// 			${claims.admin
	// 				? html`<li data-tag="admin">Admin</li>`
	// 				: null}
	// 			${claims.premium
	// 				? html`<li data-tag="premium">Premium</li>`
	// 				: null}
	// 		</ul>
	// 	`
	// }

	// private renderNicknameInput(profile: Profile) {
	// 	return html`
	// 		<input
	// 			type="text"
	// 			name="nickname"
	// 			spellcheck="false"
	// 			autocomplete="off"
	// 			placeholder="nickname"
	// 			@change=${this.handleInputChange}
	// 			@keyup=${this.inputDebouncer.queue}
	// 			.value=${profile?.nickname}
	// 			/>
	// 	`
	// }

	// private renderSaveNicknameButton() {
	// 	const showSaveButton = !!this.changedProfile
	// 	return showSaveButton ? html`
	// 		<button class="save" @click=${this.handleSaveClick}>
	// 			Save
	// 		</button>
	// 	` : null
	// }

	// private handleInputChange = () => {
	// 	const {profile} = this.share
	// 	if (!profile) return
	// 	const newProfile = this.generateNewProfileFromInputs()
	// 	const changes = !deepEqual(profile, newProfile)
	// 	this.changedProfile = changes ? newProfile : null
	// }

	// private handleSaveClick = async() => {
	// 	const {changedProfile: _changedProfile} = this
	// 	this.changedProfile = null
	// 	await this.share.saveProfile(_changedProfile)
	// }

	// private generateNewProfileFromInputs(): Profile {
	// 	const {profile} = this.share
	// 	const clonedProfile = deepClone(profile)
	// 	const input = select<HTMLInputElement>(
	// 		"input[name=nickname]",
	// 		this.shadowRoot,
	// 	)
	// 	clonedProfile.nickname = input.value
	// 	return clonedProfile
	// }
}
