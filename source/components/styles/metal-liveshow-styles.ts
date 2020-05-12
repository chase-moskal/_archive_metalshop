
import {css} from "../../framework/metalshop-component.js"
export const styles = css`

:host, :host > * {
	display: block;
}

:host([hidden]) {
	display: none;
}

* + .ghostplayer,
* + .viewer,
* + metal-is-admin > .adminpanel {
	margin-top: 1em;
}

.ghostplayer {
	position: relative;
	display: block;
	width: 100%;
	color: var(--vimeo-ghostplayer-color, inherit);
	background: var(--vimeo-ghostplayer-background, rgba(0,0,0, 0.2));
	border: var(--vimeo-ghostplayer-border, 0.2em solid rgba(0,0,0, 0.1));
}

.ghostplayer::before {
	content: "";
	display: block;
	padding-top: var(--vimeo-aspect-percentage, 56.25%);
}

.ghostplayer svg {
	position: absolute;
	opacity: var(--vimeo-ghostplayer-icon-opacity, 0.5);
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
	width: 30%;
	height: 30%;
	max-width: 10em;
}

.ghostplayer p {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.missing {
	opacity: 0.8;
	font-style: italic;
}

.viewer {
	position: relative;
}

.viewer::before {
	content: "";
	display: block;
	padding-top: var(--vimeo-aspect-percentage, 56.25%);
}

.viewer iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

metal-is-admin {
	display: block;
	max-width: 420px;
	margin-top: 0.5em;
	margin-left: auto;
	margin-right: auto;
	text-align: center;
}

metal-is-admin p,
metal-is-admin h3 {
	margin: 0.1em 0.5em;
}

metal-is-admin h3 {
	text-transform: uppercase;
}

metal-is-admin .inputarea {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

metal-is-admin .inputarea > * {
	flex: 1 1 auto;
	margin: 0.5em;
	max-width: 100%;
}

metal-is-admin .inputarea > button {
	flex: 0 1 auto;
	margin-left: auto;
}

.error {
	color: red;
	border: 1px solid;
	border-radius: 3px;
}

`
