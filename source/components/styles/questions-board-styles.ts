
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
		display: flex;
		flex-direction: var(--questions-board-flex-direction, column);
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

	slot[name=edit],
	slot[name=rate] {
		display: block;
		margin: 1.5em auto;
		text-align: center;
	}

	.question {
		display: flex;
		flex-direction: row;
		background: var(--questions-board-background, transparent);
		border-radius: var(--question-border-radius, 0.25em);
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
		text-align: center;
		margin-top: 1.2em;
	}

	.author .card {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex: 1 1 auto;
		padding-left: 0.5em;
	}

	.author avatar-display {
		flex: 0 0 auto;
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
		position: relative;
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0em;
		background: var(--question-background, rgba(255,255,255, 0.1));
		border-radius: inherit;
	}

	.body::before {
		content: "";
		display: block;
		position: absolute;
		top: 1em;
		right: 100%;
		border: 0.5em solid transparent;
		border-right-color: var(--question-background, rgba(255,255,255, 0.1));
	}
	
	.content {
		padding: 1em;
		font: inherit;
		color: inherit;
		background: transparent;
		white-space: pre-wrap;
	}

	textarea.content {
		min-height: 6em;
		transition: min-height 500ms ease;
		border: 1px dashed var(--question-background, rgba(255,255,255, 0.2));
	}

	textarea.content:focus {
		min-height: 12em;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
		padding: 0.2em;
	}

	.controls button {
		opacity: 0.7;
		border: none;
		color: inherit;
		font: inherit;
		font-size: 0.8em;
		margin: 0 0.1em;
		padding: 0.2em 0.6em;
		background: rgba(0,0,0, 0.2);
		border: 1px solid rgba(0,0,0, 0.2);
		border-radius: 3px;
		text-shadow: 1px 1px 2px rgba(0,0,0, 0.5);
		cursor: pointer;
	}

	.controls button:hover,
	.controls button:focus {
		opacity: 1;
	}

	.controls button[disabled] {
		background: rgba(255,255,255, 0.2);
		opacity: 0.4;
	}

	.question.editor {
		order: 1;
		border: 1px dashed var(--question-background, rgba(255,255,255, 0.2));
	}

	.question.editor .body textarea {
		border-radius: inherit;
	}

	.question.editor .body textarea::placeholder {
		opacity: 0.3;
	}

	.controls .postbutton {
		background: #00bb3a;
	}

	@media (max-width: 700px) {
		.question {
			flex-direction: column;
		}
		.author {
			width: unset;
			min-width: unset;
			margin-top: unset;
			margin-bottom: 0.5em;
		}
		.body::before {
			border-right-color: transparent;
			border-bottom-color: var(--question-background, rgba(255,255,255, 0.1));
			top: unset;
			right: unset;
			bottom: 100%;
			left: 1.5em;
		}
		.controls {
			order: -1;
		}
		.question.editor .controls {
			order: unset;
		}
	}
`
