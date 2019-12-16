
import {Profile} from "authoritarian/dist/interfaces"
import {property, html, css, LitElement} from "lit-element"

import {select} from "../toolbox/selects.js"
import {Debouncer} from "../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../toolbox/deep.js"
import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

import {ProfileModel} from "../interfaces.js"

export class ProfilePanel extends
	mixinLoadable(
		mixinModelSubscription<ProfileModel, typeof LitElement>(
			LitElement
		)
	)
{
	static get styles() { return [super.styles || css``, styles] }
	errorMessage = "error in profile panel"
	loadingMessage = "loading profile panel"
	
	@property({type: Object}) private _changedProfile: Profile = null
	private _inputDebouncer = new Debouncer({
		delay: 1000,
		action: () => this._handleInputChange()
	})

	onProfileSave = async(profile: Profile) => {
		this.model.saveProfile(profile)
	}

	reset() {
		this._changedProfile = null
	}

	updated() {
		const {error, loading} = this.model.reader.state
		this.loadableState = error
			? LoadableState.Error
			: loading
				? LoadableState.Loading
				: LoadableState.Ready
	}

	private _handleInputChange = () => {
		const {profile} = this.model.reader.state
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
		const profile = deepClone(this.model.reader.state.profile)
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
		const {
			_inputDebouncer,
			_handleSaveClick,
			_handleInputChange,
		} = this
		const {profile, admin, premium} = this.model.reader.state
		const showSaveButton = !!this._changedProfile

		if (!profile) return html``
		return html`
			<div class="container formarea coolbuttonarea">
				<avatar-display
					src=${profile && profile.public.picture}
					?premium=${premium}
				></avatar-display>
				<div>
					<ul>
						${admin ? html`<li data-tag="admin">Admin</li>` : html``}
						${premium ? html`<li data-tag="premium">Premium</li>` : html``}
					</ul>
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
						? html`
							<button
								class="save"
								@click=${_handleSaveClick}>
									Save
							</button>`
						: html``}
				</div>
			</div>
		`
	}
}

const styles = css`
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
		margin-top: 0.25em;
	}
	button.save {
		margin-left: auto;
	}
	ul > li {
		opacity: 0.7;
		font-size: 0.7em;
		display: inline-block;
		padding: 0.2em 0.5em;
		border-radius: 0.5em;
		font-family: monospace;
		border: 1px solid;
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
`
