
import {styles} from "./styles/details-styles.js"
import {select} from "../toolbox/selects.js"
import {DetailsShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {Profile, Claims} from "authoritarian/dist/interfaces.js"
import {makeDebouncer} from "../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../toolbox/deep.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

@mixinStyles(styles)
export class MetalProfile extends MetalshopComponent<DetailsShare> {

	render() {
		const {user, profileLoad} = this.share
		const {_profile: profile} = this
		return html`
			<iron-loading .load=${profileLoad} class="formarea coolbuttonarea">
				${(profile && user) ? html`
					<div class="container">
						<metal-avatar
							src=${profile?.avatar}
							?premium=${user.claims.premium}
						></metal-avatar>
						<div>
							${this.renderClaimsList(user)}
							${this.renderNicknameInput()}
							${this.renderSaveNicknameButton()}
						</div>
					</div>
				` : null}
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
				@keyup=${() => {
					console.log("QUEUE")
					this._inputDebouncer.queue()
				}}
				.value=${this._profile.nickname}
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

	private get _profile() {
		return loading.payload(this.share.profileLoad)
	}

	private _handleInputChange = () => {
		const {_profile} = this
		if (!_profile) return
		const newProfile = this._generateNewProfileFromInputs()
		const changes = !deepEqual(_profile, newProfile)
		this._changedProfile = changes ? newProfile : null
	}

	private _handleSaveClick = async() => {
		const {_changedProfile} = this
		this._changedProfile = null
		await this.share.saveProfile(_changedProfile)
	}

	private _generateNewProfileFromInputs(): Profile {
		const profile = deepClone(this._profile)
		const input = select<HTMLInputElement>(
			"input[name=nickname]",
			this.shadowRoot,
		)
		profile.nickname = input.value
		return profile
	}
}
