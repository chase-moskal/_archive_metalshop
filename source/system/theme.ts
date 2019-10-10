
import {css} from "lit-element"

export const theme = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.inputfield {
		display: flex;
		flex-direction: row;
		background: white;
		border: 1px solid rgba(0,0,0, 0.2);
	}

	.inputfield > * {
		flex: 0 0 auto;
	}

	.inputfield input {
		display: block;
		padding: 0.1em 0.2em;
		margin: auto;
		border: none;
		background: white;
	}

	.inputfield button {
		display: block;
		background: slateblue;
	}
`
