
import {styles} from "./details-styles.js"
import {litLoading} from "../iron-loading.js"
import {select} from "../../toolbox/selects.js"
import {DetailsShare} from "../../interfaces.js"
import * as loading from "../../toolbox/loading.js"
import {Profile} from "authoritarian/dist/interfaces.js"
import {makeDebouncer} from "../../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../../toolbox/deep.js"
import {MetalshopComponent, property, html, css} from "../../framework/metalshop-component.js"

export class MetalProfile extends MetalshopComponent<DetailsShare> {
	static get styles() { return [super.styles || css``, styles] }

	render() {
		const {renderProfile} = this
		const {profileLoad} = this.share
		return html`
			<div class="profile">
				${litLoading(profileLoad, renderProfile)}
			</div>
		`
	}

	@property({type: Object}) private _changedProfile: Profile = null

	private _inputDebouncer = makeDebouncer({
		delay: 1000,
		action: () => this._handleInputChange()
	})

	private get _profile() {
		const {profileLoad} = this.share
		return profileLoad.state == loading.LoadState.Ready
			? profileLoad.payload
			: null
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
			this.shadowRoot
		)
		profile.nickname = input.value
		return profile
	}

	private renderProfile = (profile: Profile) => {
		const {user} = this.share
		const {
			_inputDebouncer,
			_handleSaveClick,
			_handleInputChange,
		} = this
		const showSaveButton = !!this._changedProfile
		return html`
			<div class="panel">
				<div class="container formarea coolbuttonarea">
					<metal-avatar
						src=${profile && profile.avatar}
						?premium=${user.claims.premium}
					></metal-avatar>
					<div>
						<ul>
							${user.claims.admin
								? html`<li data-tag="admin">Admin</li>`
								: null}
							${user.claims.premium
								? html`<li data-tag="premium">Premium</li>`
								: null}
						</ul>
						<input
							type="text"
							name="nickname"
							spellcheck="false"
							autocomplete="off"
							placeholder="nickname"
							@change=${_handleInputChange}
							@keyup=${_inputDebouncer.queue}
							.value=${profile.nickname}
							/>
						${showSaveButton
							? html`
								<button
									class="save"
									@click=${_handleSaveClick}>
										Save
								</button>`
							: null}
					</div>
				</div>
				<metal-admin-mode>Admin mode</metal-admin-mode>
			</div>
		`
	}
}
