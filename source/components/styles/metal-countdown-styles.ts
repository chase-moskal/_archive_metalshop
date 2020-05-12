
import {css} from "lit-element"

export const styles = css`
	:host {
		display: flex;
		flex-direction: row;
	}

	:host([hidden]) {
		display: none;
	}

	:host > div {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.icon-area svg {
		opacity: var(--countdown-icon-opacity, 0.5);
		width: var(--countdown-icon-size, 6em);
		height: var(--countdown-icon-size, 6em);
	}

	.content-area {
		padding-left: 0.5em;
	}

	.countdown .start-time > span > span:nth-child(3) {
		opacity: 0.5;
	}

	metal-is-admin {
		margin-top: 0.5em;
	}

	@media (max-width: 700px) {
		.icon-area {
			font-size: 0.5em;
		}
		.countdown p > strong {
			display: block;
			margin-top: 0.2em;
		}
	}
`
