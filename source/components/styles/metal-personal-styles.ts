
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
