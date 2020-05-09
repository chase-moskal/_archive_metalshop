
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
	background: #6b222296;
}

.panel + * {
	margin-top: 0.5em;
}

.panel > * + * {
	margin-top: 0.5em;
}

.panel.premium .banner {
	display: flex;
	width: 100%;
	flex-direction: row;
	align-items: center;
}

.panel.premium .banner * {
	flex: 0 0 auto;
}

.panel.premium .banner svg {
	width: 5em;
	height: 5em;
	color: yellow;
	border-radius: 5em;
	background: rgba(255,255, 64, 0.5);
}

.panel.premium .banner h3 {
	padding: 1em;
}

.buttonbar {
	width: 100%;
}

.buttonbar.right {
	text-align: right;
}

`
