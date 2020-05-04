
import {css} from "../metalshop-component.js"
export const styles = css`

.loadable {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8em;
	font-family: monospace;
	color: inherit;
}

.loadable svg {
	width: 2em;
	height: 2em;
	margin-right: 1em;
}

@keyframes loadable-spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes loadable-fade {
	from { opacity: 0.8; }
	to { opacity: 0.4; }
}

.loadable.loading svg {
	opacity: 0.5;
	animation:
		loadable-spin 10s linear infinite,
		loadable-fade 500ms linear infinite alternate;
}

.loadable.error {
	color: maroon;
}

`
