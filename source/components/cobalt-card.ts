
import {select} from "../toolbox/selects.js"
import {formatDate} from "../toolbox/dates.js"
import * as loading from "../toolbox/loading.js"
import {makeDebouncer} from "../toolbox/debouncer.js"
import {deepClone, deepEqual} from "../toolbox/deep.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {Profile, Claims, Persona} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html, property, css} from "../framework/metalshop-component.js"

const styles = css`

.claims {
	list-style: none;
	font-size: 0.6em;
	margin-bottom: 0.25rem;
}

.claims > li {
	display: inline-block;
	margin: 0 0.1em;
	padding: 0 0.25em;
	border: 1px solid;
	border-radius: 1em;
}

[data-tag=banned] {
	color: red;
}

[data-label=method-man] {
	color: lime;
}


.textfield {
	display: block;
	width: 100%;
	max-width: 18em;
}

.tagline {
	font-style: italic;
}

.tagline.value-present::before,
.tagline.value-present::after {
	content: '"';
}

.cardplate > * {
	display: block;
}

.cardplate > iron-text-input + iron-text-input {
	margin-top: 0.2rem;
}

.detail {
	opacity: 0.75;
	font-size: 0.7em;
	list-style: none;
	margin-top: 0.5rem;
}

.buttonbar {
	margin-top: 1rem;
	text-align: right;
}

`

 @mixinStyles(styles)
export class CobaltCard extends MetalshopComponent<void> {

	@property({type: Object})
		persona?: Persona

	@property({type: Object})
		saveProfile?: (profile: Profile) => Promise<void>

	@property({type: Boolean})
		private busy: boolean = false

	@property({type: Object})
		private changedProfile: Profile = null

	private generateNewProfileFromInputs(): Profile {
		const {profile} = this.persona
		const clonedProfile = deepClone(profile)
		const getValue = (name: string) => select<HTMLInputElement>(
			`iron-text-input.${name}`,
			this.shadowRoot,
		).value
		clonedProfile.nickname = getValue("nickname")
		clonedProfile.tagline = getValue("tagline")
		return clonedProfile
	}

	private handleChange = () => {
		const {profile} = this.persona
		const newProfile = this.generateNewProfileFromInputs()
		const changes = !deepEqual(profile, newProfile)
		this.changedProfile = changes ? newProfile : null
	}

	private inputDebouncer = makeDebouncer({
		delay: 200,
		action: () => this.handleChange()
	})

	private renderClaimsList(claims: Claims = {}) {
		const renderTag = (tag: string) => html`<li data-tag=${tag}>${tag}</li>`
		const renderLabel = (label: string) => html`<li data-label=${label}>${label}</li>`
		let items = []
		if (claims.banned) items.push(renderTag("banned"))
		if (claims.labels) items = [...items, claims.labels.map(renderLabel)]
		if (claims.admin) items.push(renderTag("admin"))
		if (claims.staff) items.push(renderTag("staff"))
		if (claims.premium) items.push(renderTag("premium"))
		if (claims.moderator) items.push(renderTag("moderator"))
		return items.length
			? html`<ol class="claims">${items}</ol>`
			: null
	}

	private renderTextfield(name: string, value: string) {
		const readonly = !this.saveProfile
		return html`
			<iron-text-input
				class=${name}
				.value=${value}
				?nolabel=${readonly}
				?readonly=${readonly}
				@textchange=${this.inputDebouncer.queue}>
					${name}
			</iron-text-input>
		`
	}

	private handleSave = async() => {
		const {changedProfile} = this
		this.busy = true
		this.changedProfile = null
		try {
			await this.saveProfile(changedProfile)
		}
		finally {
			this.busy = false
		}
	}

	render() {
		const {persona, busy} = this
		if (!persona) return null
		const {user, profile} = persona
		const {datestring} = formatDate(profile.joined)
		const load = busy ? loading.loading() : loading.ready()
		return html`
			<iron-loading .load=${load} class="cardplate formarea coolbuttonarea">
				${this.renderClaimsList(user.claims)}
				${this.renderTextfield("nickname", profile.nickname)}
				${this.renderTextfield("tagline", profile.tagline)}
				<ul class="detail">
					<li>user id: <span>${profile.userId}</span></li>
					<li>joined: <span>${datestring}</span></li>
				</ul>
				${this.changedProfile ? html`
					<div class="buttonbar">
						<button @click=${this.handleSave}>
							Save
						</button>
					</div>
				` : null}
			</iron-loading>
		`
	}
}
