
import {LitElement, property, html, css, PropertyValues} from "lit-element"
import {ProfileLoadedEvent} from "../events/profile-loaded-event.js"
import {
	Profile,
	AuthContext,
	UserSubpanel,
	ProfileManagerTopic,
} from "../interfaces.js"

export class ProfileSubpanel extends LitElement implements UserSubpanel {
	@property({type: Object}) profileManager: ProfileManagerTopic = null

	@property({type: Object}) profile: Profile = null
	@property({type: Object}) authContext: AuthContext = null

	updated(changedProperties: PropertyValues) {
		if (changedProperties.has("authContext")) {
			this._loadProfile()
		}
	}

	private async _loadProfile() {
		if (this.authContext) {
			const {accessToken} = this.authContext
			this.profile = await this.profileManager.getProfile({accessToken})
			this.dispatchEvent(new ProfileLoadedEvent(this.profile))
		}
		else {
			this.profile = null
		}
	}

	static get styles() {
		return css``
	}

	render() {
		const {profile} = this
		return profile ? html`
			<img src=${profile.picture} alt="[your profile picture]"/>
			<h2>${profile.realname}</h2>
			<p>Display name: ${profile.nickname}</p>
		` : html``
	}
}
