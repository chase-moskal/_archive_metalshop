
import {css} from "lit-element"

export const theme = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/*
	FORMAREA
	*/

	.formarea input {
		padding: 0.2em;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		background: transparent;
		border: 1px solid rgba(0,0,0, 0.1);
		border-radius: 3px;
	}

	.formarea input:hover {
		border: 1px solid rgba(0,0,0, 0.2);
	}

	.formarea input:focus {
		outline: var(--focus-outline, 2px solid cyan);
		background: rgba(255,255,255, 0.8);
	}

	/*
	COOLBUTTONS
	*/

	.coolbuttonarea button {
		position: relative;
		user-select: none;
		font-family: var(--coolbutton-font-family, inherit);
		font-weight: bold;
		font-size: var(--coolbutton-font-size, 1rem);
		border: none;
		padding: 0.2em 1em;
		background: var(--coolbutton-background, #5c54d8);
		color: white;
		box-shadow: 1px 2px 1px rgba(0,0,0, 0.15);
		text-shadow: 0 0 7px rgba(255,255,255, 0.4);
		cursor: pointer;
	}
	.coolbuttonarea button:hover,
	.coolbuttonarea button:focus {
		outline: var(--focus-outline, 2px solid cyan);
		text-decoration: underline;
		text-shadow: 0 0 7px rgba(255,255,255, 0.7);
	}

	.coolbuttonarea button:hover::before,
	.coolbuttonarea button:focus::before {
		content: "";
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255,255,255, 0.1);
	}
	.coolbuttonarea button:active::before {
		background: rgba(0,0,0, 0.1);
	}
`
