
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

iron-loading {
	display: flex;
	flex-direction: row;
	width: 100%;
}

iron-loading > * {
	flex: 0 1 auto;
}

iron-loading > * + * {
	margin-left: 1em;
}

.panel {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	justify-content: flex-start;
}

.panel > * {
	flex: 0 0 auto;
}

.panel.premium {
	width: 6em;
	color: var(--premium-color, yellow);
}

.panel.no-premium {
	width: 8em;
}

.panel.subscription,
.panel.no-subscription {
	flex-grow: 1;
	justify-content: center;
}

.panel.premium svg {
	width: 6em;
	height: 6em;
	border-radius: 6em;
	background: var(--premium-background, rgba(255,255, 64, 0.5));
}

.panel.premium h3 {
	font-size: 1em;
	text-align: center;
	width: 100%;
}

.panel.no-premium h3 {
	font-size: 1em;
	font-weight: inherit;
}

.buttonbar {
	width: 100%;
	margin: 0.4em auto;
}

.buttonbar.right {
	text-align: right;
}

`
