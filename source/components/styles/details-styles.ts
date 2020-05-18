
import {css} from "../../framework/metalshop-component.js"
export const styles = css`

:host {
	display: block;
}

:host([hidden]) {
	display: none;
}

iron-loading {
	display: flex;
	flex-direction: row;
}

cobalt-card {
	padding-left: 1em;
}

`
// export const styles = css`

// * {
// 	margin: 0;
// 	padding: 0;
// 	box-sizing: border-box;
// }

// :host {
// 	display: block;
// }

// :host([hidden]) {
// 	display: none;
// }

// .panel > * + * {
// 	margin-top: 0.5em;
// }

// .container {
// 	display: flex;
// 	flex-direction: row;
// }

// metal-avatar {
// 	flex: 0 0 auto;
// 	--avatar-size: 6em;
// 	--avatar-border: 5px solid rgba(255,255,255, 0.5);
// }

// .container > div {
// 	flex: 1 1 auto;
// 	display: flex;
// 	margin-left: 1em;
// 	flex-direction: column;
// 	justify-content: center;
// }

// .container > div > * + * {
// 	margin-top: 0.25em;
// }

// button.save {
// 	margin-left: auto;
// }

// ul > li {
// 	opacity: 0.7;
// 	font-size: 0.7em;
// 	display: inline-block;
// 	padding: 0.2em 0.5em;
// 	border-radius: 0.5em;
// 	font-family: monospace;
// 	border: 1px solid;
// }

// input {
// 	width: 100%;
// }

// h3 {
// 	font-size: 1.1em;
// }

// @media (max-width: 450px) {
// 	.container {
// 		flex-direction: column;
// 		align-items: flex-start;
// 	}
// }

// `
