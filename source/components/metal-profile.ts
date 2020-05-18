
import {ProfileShare} from "../interfaces.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, css} from "../framework/metalshop-component.js"

export const styles = css`

:host {
	display: block;
}

:host([hidden]) {
	display: none;
}

iron-loading {
	display: flex;
	flex-direction: row;
}

cobalt-card {
	padding-left: 1em;
}

`

 @mixinStyles(styles)
export class MetalProfile extends MetalshopComponent<ProfileShare> {

	render() {
		const {profileLoad, user, profile} = this.share
		const persona = (user && profile )? {user, profile} : null
		return html`
			<iron-loading
				.load=${profileLoad}
				class="container formarea coolbuttonarea">
					<cobalt-avatar .persona=${persona}></cobalt-avatar>
					<cobalt-card .persona=${persona}></cobalt-card>
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
