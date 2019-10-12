
import {property, html, css} from "lit-element"
import {Profile} from "authoritarian/dist/interfaces"

import {select} from "../toolbox/selects.js"
import {Debouncer} from "../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../toolbox/deep.js"
import {ProfileState, AvatarState} from "../system/interfaces.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

export class ProfilePanel extends LoadableElement {
	@property({type: Object}) avatarState: AvatarState
	@property({type: Object}) profileState: ProfileState
	onProfileSave = async(profile: Profile) => {}
	errorMessage = "error in profile panel"
	loadingMessage = "loading profile panel"

	@property({type: Object}) _changedProfile: Profile = null
	private _inputDebouncer = new Debouncer({
		delay: 1000,
		action: () => this._handleInputChange()
	})

	reset() {
		this._changedProfile = null
	}

	updated() {
		if (this.profileState) {
			const {error, loading} = this.profileState
			this.loadableState = error
				? LoadableState.Error
				: loading
					? LoadableState.Loading
					: LoadableState.Ready
		}
	}

	static get styles() {return [super.styles, css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		.container {
			display: flex;
			flex-direction: row;
		}
		avatar-display {
			flex: 0 0 auto;
			--avatar-display-size: 25%;
			border: 5px solid rgba(255,255,255, 0.5);
		}
		.container > div {
			flex: 1 1 auto;
			display: flex;
			padding: 0.5em;
			flex-direction: column;
			justify-content: center;
		}
		.container > div > * + * {
			margin-top: 0.6em;
		}
		button.save {
			margin-left: auto;
		}
		input {
			width: 100%;
		}
		h3 {
			font-size: 1.1em;
		}
		@media (max-width: 600px) {
			.container {
				flex-direction: column;
				align-items: flex-start;
			}
			avatar-display {
				--avatar-display-size: 5em;
				margin: auto;
			}
		}
	`]}

	private _handleInputChange = () => {
		const {profile} = this.profileState
		if (!profile) return
		const newProfile = this._generateNewProfileFromInputs()
		const changes = !deepEqual(profile, newProfile)
		this._changedProfile = changes ? newProfile : null
	}

	private _handleSaveClick = async() => {
		const {_changedProfile} = this
		this._changedProfile = null
		await this.onProfileSave(_changedProfile)
	}

	private _generateNewProfileFromInputs(): Profile {
		const profile = deepClone(this.profileState.profile)
		{
			const input = select<HTMLInputElement>(
				"input[name=nickname]",
				this.shadowRoot
			)
			profile.public.nickname = input.value
		}
		return profile
	}

	renderReady() {
		if (!this.avatarState || !this.profileState) return
		const {
			avatarState,
			_inputDebouncer,
			_handleSaveClick,
			_handleInputChange,
		} = this
		const {profile} = this.profileState
		const showSaveButton = !!this._changedProfile

		if (!profile) return html``
		return html`
			<div class="container formarea coolbuttonarea">
				<avatar-display .avatarState=${avatarState}></avatar-display>
				<div>
					<h3>${profile.private.realname}</h3>
					<input
						type="text"
						name="nickname"
						spellcheck="false"
						autocomplete="off"
						placeholder="nickname"
						@change=${_handleInputChange}
						@keyup=${_inputDebouncer.queue}
						.value=${profile.public.nickname}
						/>
					${showSaveButton
						? html`<button class="save" @click=${_handleSaveClick}>Save</button>`
						: html``}
				</div>
			</div>
		`
	}
}
