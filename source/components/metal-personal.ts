
import {PersonalShare} from "../interfaces.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "./styles/metal-personal-styles.js"
import {Profile} from "authoritarian/dist/interfaces.js"
import {MetalshopComponent, html} from "../framework/metalshop-component.js"

 @mixinStyles(styles)
export class MetalPersonal extends MetalshopComponent<PersonalShare> {

	render() {
		const {personal, personalLoad, saveProfile} = this.share
		return html`
			<iron-loading
				.load=${personalLoad}
				class="container formarea coolbuttonarea">
					<cobalt-avatar .persona=${personal}></cobalt-avatar>
					<cobalt-card
						.persona=${personal}
						.saveProfile=${(profile: Profile) => {
							console.log("PROFILE", profile)
							return saveProfile(profile)
						}}
					></cobalt-card>
			</iron-loading>
		`
	}
}
