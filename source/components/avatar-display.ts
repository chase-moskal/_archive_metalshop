
import {LitElement, property, html, css, svg} from "lit-element"

import {AvatarReader} from "../system/interfaces.js"
import {AuthoritarianAvatarError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianAvatarError(message)

const defaultPicture = html`${svg`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 0 1-.998.998H1.001A1 1 0 0 1 0 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"/></svg>`}`


export class AvatarDisplay extends LitElement {
	@property({type: Object}) avatarReader: AvatarReader
	@property({type: String}) url: string
	@property({type: Boolean}) premium: boolean

	static get styles() {return css`

	`}

	render() {
		const {url, premium} = this
		return html`
			<img src=${url}
				?data-premium=${premium}
				alt=""/>
		`
	}
}
