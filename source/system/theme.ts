
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

::placeholder { color: inherit; }
::-webkit-input-placeholder { color: inherit; }
:-moz-placeholder { color: inherit; }
::-moz-placeholder { color: inherit; }
:-ms-input-placeholder { color: inherit; }

.formarea input {
	opacity: 0.7;
	padding: 0.2em;
	font-size: inherit;
	font-family: inherit;
	color: inherit;
	background: transparent;
	border: 1px solid;
	border-radius: 3px;
}

.formarea input:hover {
	opacity: 1;
}

.formarea input:focus {
	opacity: 1;
	outline: var(--focus-outline, 2px solid cyan);
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
	text-decoration: underline;
	text-shadow: 0 0 7px rgba(255,255,255, 0.7);
}

.coolbuttonarea button:focus {
	outline: var(--focus-outline, 2px solid cyan);
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

.coolbuttonarea button[disabled] {
	background: var(--coolbutton-disabled-background, rgba(100,100,100, 0.5));
	text-decoration: none;
	color: rgba(255,255,255, 0.4);
	text-shadow: 0 0 7px rgba(255,255,255, 0.2);
	cursor: default;
}

.coolbuttonarea button[disabled]::before {
	display: none !important;
}

`
