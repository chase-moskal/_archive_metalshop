
import {css} from "lit-element"

export const styles = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	*:focus {
		outline: var(--focus-outline, 2px solid cyan);
	}

	:host {
		display: block;
	}

	:host([hidden]) {
		display: none;
	}

	.questions {
		list-style: none;
	}

	.questions > li + li {
		margin-top: 1em;
	}

	.question {
		display: flex;
		flex-direction: row;
		background: var(--questions-board-background, transparent);
		border: var(--questions-board-border, 1px solid rgba(255,255,255, 0.2));
	}

	.question.editor {
		margin-bottom: 2em;
	}

	.question > * {
		flex: 0 0 auto;
	}

	.author {
		font-size: 0.8em;
		display: flex;
		flex-direction: row;
		width: 32%;
		min-width: 16em;
		padding: 0.5em;
		text-align: center;
		background: rgba(255,255,255, 0.1);
	}

	.author .card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 1 auto;
		padding-left: 0.5em;
	}

	.author avatar-display {
		flex: 0 0 auto;
		margin: auto;
		--avatar-display-size: 5em;
	}

	.author .details {
		margin-top: 0.25em;
	}

	.author .nickname {
		text-align: left;
		font-weight: bold;
	}

	.author .time {
		opacity: 0.5;
	}

	.author .likes,
	.author .time {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.likebutton {
		opacity: 0.6;
		border: none;
		display: flex;
		align-items: center;
		font: inherit;
		color: inherit;
		background: transparent;
		cursor: pointer;
	}

	.likebutton > * {
		flex: 1 1 auto;
	}

	.likebutton .like-heart {
		font-size: 1.5em;
	}

	.likebutton .like-number {
		padding-left: 0.2em;
	}

	.likebutton:hover {
		opacity: 1;
	}

	.body {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
	}
	
	.content {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		padding: 0.3em 1em;
		font: inherit;
		color: inherit;
		background: transparent;
	}

	textarea.content {
		background: rgba(255,255,255, 0.2);
		border-radius: 5px;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
	}

	.controls button {
		border: none;
		color: inherit;
		font: inherit;
		background: transparent;
	}

	.question.editor {
		padding-left: 2em;
		padding-right: 2em;
		border: none;
	}

	@media (max-width: 700px) {
		.question {
			flex-direction: column;
		}
		.author {
			width: unset;
			min-width: unset;
		}
		.controls {
			order: -1;
		}
		.question.editor .controls {
			order: unset;
		}
	}
`
