
import {Persona} from "../interfaces.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {Profile, Claims} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html, property, css} from "../framework/metalshop-component.js"

const styles = css`

.claims {
	list-style: none;
	font-size: 0.6em;
	margin-bottom: 0.25rem;
}

.claims > li {
	display: inline-block;
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

.tagline::before,
.tagline::after {
	content: '"';
}

.detail {
	font-size: 0.7em;
	list-style: none;
	margin-top: 0.25rem;
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

	private renderClaimsList(claims: Claims = {}) {
		const renderTag = (tag: string) => html`<li data-tag=${tag}>${tag}</li>`
		const renderLabel = (label: string) => html`<li data-label=${label}>${label}</li>`
		return html`
			<ol class="claims">
				${claims.banned ? renderTag("banned") : null}
				${claims.labels ? claims.labels.map(renderLabel) : null}
				${claims.admin ? renderTag("admin") : null}
				${claims.staff ? renderTag("staff") : null}
				${claims.premium ? renderTag("premium") : null}
				${claims.moderator ? renderTag("moderator") : null}
			</ol>
		`
	}

	private renderTextfield(name: string, value: string) {
		return this.saveProfile ? html`
			<input
				class="textfield ${name}"
				type="text"
				name=${name}
				maxlength="32"
				spellcheck="false"
				autocomplete="off"
				placeholder=${name}
				.value=${value}
				/>
		` : html`
			<p class="textfield ${name}">${value}</p>
		`
	}

	render() {
		const {persona} = this
		if (!persona) return null
		const {user, profile} = persona
		return html`
			<div class="cardplate formarea coolbuttonarea">
				${this.renderClaimsList(user.claims)}
				${this.renderTextfield("nickname", profile.nickname)}
				${this.renderTextfield("tagline", "wu tang style")}
				<ul class="detail">
					<li>user id: <span>${profile.userId}</span></li>
					<li>joined: <span>unknown</span></li>
				</ul>
			</div>
		`
	}
}
