
import {LitElement, html} from "lit-element"
import {User, Profile} from "authoritarian/dist/interfaces.js"

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
			<cobalt-avatar .persona=${persona}></cobalt-avatar>
			<cobalt-card .persona=${persona}></cobalt-card>
		`
	}
}
