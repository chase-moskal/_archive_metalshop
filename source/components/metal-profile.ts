
import {select} from "../toolbox/selects.js"
import {DetailsShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {styles} from "./styles/details-styles.js"
import {makeDebouncer} from "../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../toolbox/deep.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {Profile, Claims, User} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

@mixinStyles(styles)
export class MetalProfile extends MetalshopComponent<DetailsShare> {

	@property({type: Object})
		private user: User = null

	@property({type: Object})
		private profile: Profile = null

	autoruns = [
		() => this.autorunAuth(),
		() => this.autorunProfile(),
	]

	private async autorunAuth() {
		const {authLoad} = this.share
		this.user = null
		const getAuthContext = loading.payload(authLoad)?.getAuthContext
		if (getAuthContext) {
			const {user} = await getAuthContext()
			this.user = user
		}
	}

	private autorunProfile() {
		this.profile = null
		const {profileLoad} = this.share
		const profile = loading.payload(profileLoad)
		this.profile = profile
	}

	render() {
		const {user, profile} = this
		const {profileLoad} = this.share
		const premium = user?.claims.premium
		return html`
			<iron-loading .load=${profileLoad} class="formarea coolbuttonarea">
				<div class="container">
					<metal-avatar
						src=${profile?.avatar}
						?premium=${premium}
					></metal-avatar>
					<div>
						${this.renderClaimsList(user)}
						${this.renderNicknameInput()}
						${this.renderSaveNicknameButton()}
					</div>
				</div>
			</iron-loading>
		`
	}

	private renderClaimsList(user: Claims) {
		return html`
			<ul>
				${user.claims.admin
					? html`<li data-tag="admin">Admin</li>`
					: null}
				${user.claims.premium
					? html`<li data-tag="premium">Premium</li>`
					: null}
			</ul>
		`
	}

	private renderNicknameInput() {
		return html`
			<input
				type="text"
				name="nickname"
				spellcheck="false"
				autocomplete="off"
				placeholder="nickname"
				@change=${this._handleInputChange}
				@keyup=${this._inputDebouncer.queue}
				.value=${this.profile?.nickname}
				/>
		`
	}

	private renderSaveNicknameButton() {
		const showSaveButton = !!this._changedProfile
		return showSaveButton ? html`
			<button class="save" @click=${this._handleSaveClick}>
				Save
			</button>
		` : null
	}

	@property({type: Object}) private _changedProfile: Profile = null

	private _inputDebouncer = makeDebouncer({
		delay: 1000,
		action: () => this._handleInputChange()
	})

	private _handleInputChange = () => {
		const {profile} = this
		if (!profile) return
		const newProfile = this._generateNewProfileFromInputs()
		const changes = !deepEqual(profile, newProfile)
		this._changedProfile = changes ? newProfile : null
	}

	private _handleSaveClick = async() => {
		const {_changedProfile} = this
		this._changedProfile = null
		await this.share.saveProfile(_changedProfile)
	}

	private _generateNewProfileFromInputs(): Profile {
		const profile = deepClone(this.profile)
		const input = select<HTMLInputElement>(
			"input[name=nickname]",
			this.shadowRoot,
		)
		profile.nickname = input.value
		return profile
	}
}
