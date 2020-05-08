
import {css} from "lit-element"
export const styles = css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:host {
	display: block;
	padding: 1em 0;
}

header .icon {
	float: right;
	color: var(--paywall-premium-star-color, yellow);
}

header .icon svg {
	width: 4em;
	height: 4em;
	margin-right: 0.5em;
}

section {
	padding: 1em 0;
}

footer > * {
	padding: 0 0.5em;
}

footer > span {
	opacity: 0.8;
	font-size: 0.8em;
}

button.update {
	background: #50505096;
}

button.cancel {
	background: #401c1c96;
}

`
