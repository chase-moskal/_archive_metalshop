
import {css} from "lit-element"
export const styles = css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

[data-load="none"] { display: block; }
[data-load="loading"] { display: block; }
[data-load="error"] { color: red; }
[data-load="ready"] { display: block; }

.icon {
	display: flex;
	align-items: center;
}

.icon svg {
	width: 1.2em;
	height: 1.2em;
	margin-right: 0.3em;
}

:host([state=loading]) .icon {
	color: var(--iron-loading-color, inherit);
	opacity: var(--iron-loading-opacity, 0.8);
}

:host([state=error]) .icon {
	color: var(--iron-loading-error-color, maroon);
	opacity: var(--iron-loading-error-opacity, 1);
}

:host([state=loading]) .icon svg {
	animation:
		iron-spin 10s linear infinite,
		iron-fade 1s ease infinite alternate;
}

@keyframes iron-spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes iron-fade {
	from { opacity: 1.0; }
	to { opacity: 0.5; }
}

`
