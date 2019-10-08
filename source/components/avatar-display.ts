
import {LitElement, property, html, css, svg} from "lit-element"

import {AvatarReader} from "../system/interfaces.js"
import {AuthoritarianAvatarError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianAvatarError(message)

export class AvatarDisplay extends LitElement {
	@property({type: Object}) avatarReader: AvatarReader
	@property({type: String}) url: string
	@property({type: Boolean}) premium: boolean

	static get styles() {return css`

	`}

	render() {
		return html``
	}
}
