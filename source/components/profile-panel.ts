
import {property, html, css} from "lit-element"
import {Profile} from "authoritarian/dist/interfaces"
import {ProfileState, AvatarState} from "../system/interfaces.js"
import {LoadableElement, LoadableState} from "../toolbox/loadable-element.js"

export class ProfilePanel extends LoadableElement {
	@property({type: Object}) avatarState: AvatarState
	@property({type: Object}) profileState: ProfileState
	onProfileSave = async(profile: Profile) => {}
	errorMessage = "error in profile panel"
	loadingMessage = "loading profile panel"

	@property({type: Boolean}) _saving: boolean = false
	@property({type: Object}) _changedProfile: Profile = null

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
		h2 {
			font-size: 1.1em;
		}
		@media (max-width: 400px) {
			.container {
				flex-direction: column;
				align-items: flex-start;
			}
			avatar-display {
				--avatar-display-size: 68%;
				margin: auto;
			}
		}
	`]}

	private _handleInputChange = () => {
		const {profile} = this.profileState
		const newProfile = this._generateNewProfileFromInputs()
		const changes = this._compareProfilesForChanges(profile, newProfile)
		this._changedProfile = changes ? newProfile : null
	}

	private _handleSaveClick = async() => {
		this._saving = true
		await this.onProfileSave(this._changedProfile)
		this._changedProfile = null
		this._saving = false
	}

	private _generateNewProfileFromInputs(): Profile {
		return null
	}

	private _compareProfilesForChanges(a: Profile, b: Profile): boolean {
		return false
	}

	renderReady() {
		if (!this.avatarState || !this.profileState) return
		const {
			avatarState,
			_handleInputChange,
			_handleSaveClick,
		} = this
		const {profile} = this.profileState
		const showSaveButton = !this._saving && !!this._changedProfile

		if (!profile) return html``
		return html`
			<div class="container">
				<avatar-display .avatarState=${avatarState}></avatar-display>
				<div>
					<h2>${profile.private.realname}</h2>
					<p>${profile.public.nickname}</p>
					<input
						type="text"
						placeholder="nickname"
						@change=${_handleInputChange}
						.value=${profile.public.nickname}
						/>
				</div>
			</div>
			${showSaveButton
				? html`<button @click=${_handleSaveClick}>Save</button>`
				: html``}
		`
	}
}
