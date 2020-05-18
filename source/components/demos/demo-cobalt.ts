
import {LitElement, html, css} from "lit-element"
import {mixinStyles} from "../../framework/mixin-styles.js"
import {User, Profile} from "authoritarian/dist/interfaces.js"

const styles = css`

.complex {
	display: flex;
	flex-direction: row;
	background: rgba(255,255,255, 0.1);
	padding: 0.5em;
}

cobalt-card {
	padding-left: 1em;
}

`

 @mixinStyles(styles)
export class DemoCobalt extends LitElement {
	render() {
		const user: User = {
			userId: "7E6A12B9",
			claims: {
				banned: true,
				admin: true,
				premium: true,
				labels: [
					"method-man"
				],
			},
		}
		const profile: Profile = {
			userId: user.userId,
			nickname: "Method Man",
			// avatar: null,
			avatar: "https://i.imgur.com/CEqYyCy.jpg",
		}
		const persona = {user, profile}
		return html`
			<div class="complex">
				<cobalt-avatar .persona=${persona}></cobalt-avatar>
				<cobalt-card .persona=${persona}></cobalt-card>
			</div>
		`
	}
}
