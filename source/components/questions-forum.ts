
import {LitElement, property, html, css, svg} from "lit-element"
import {Question} from "../system/interfaces"

export class QuestionsForum extends LitElement {
	@property({type: Boolean}) admin: boolean = false
	@property({type: Object}) questions: Question[] = []

	static get styles() {return css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
	`}

	render() {
		return html`

		`
	}
}

