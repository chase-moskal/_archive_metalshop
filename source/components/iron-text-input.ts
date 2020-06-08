
import {makeDebouncer} from "../toolbox/debouncer.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, property, css} from "../framework/metalshop-component.js"

const styles = css`

* {
	margin: 0;
	padding: 0;
}

label {
	display: inline-flex;
	flex-direction: column;
	width: min-content;
}

slot {
	font-size: 0.8em;
}

:host([nolabel]) slot {
	display: none;
}

input {
	font: inherit;
	color: inherit;
	border-radius: 3px;
	background: transparent;
	border: none;
}

input:not([readonly]) {
	border: 1px solid;
}

input:focus {
	outline: none;
}

input:focus:not([readonly]) {
	outline: var(--focus-outline, 1px solid cyan);
}

slot, input:not([readonly]) {
	padding: 0.2rem 0.3rem;
}

slot {
	display: block;
	opacity: 0.5;
	padding-top: 0;
	padding-bottom: 0;
}

input:not([readonly]) {
	opacity: 0.7;
}

input:hover, input:focus {
	opacity: 1;
}

`

export class TextChangeEvent extends CustomEvent<{text: string}> {
	constructor(text: string) {
		super("textchange", {
			bubbles: true,
			composed: true,
			detail: {text},
		})
	}
}

 @mixinStyles(styles)
export class IronTextInput extends MetalshopComponent<void> {

	@property({type: String})
		value: string = ""

	@property({type: Boolean, reflect: true})
		readonly: boolean = false

	@property({type: Boolean, reflect: true})
		nolabel: boolean = false

	@property({type: Number, reflect: true})
		maxlength: number = 32

	private lastValue = ""

	private handleInputChange = (event: InputEvent) => {
		const input = <HTMLInputElement>event.currentTarget
		this.value = input.value
		this.debouncer.queue()
	}

	private debouncer = makeDebouncer({
		delay: 500,
		action: () => {
			const {lastValue, value} = this
			if (value !== lastValue) this.dispatchEvent(new TextChangeEvent(value))
			this.lastValue = value
		},
	})

	render() {
		return html`
			<label>
				<slot></slot>
				<input
					type="text"
					spellcheck="false"
					autocomplete="off"
					.value=${this.value || ""}
					?readonly=${this.readonly}
					maxlength=${this.maxlength}
					@change=${this.handleInputChange}
					@keyup=${this.handleInputChange}
					/>
			</label>
		`
	}
}
