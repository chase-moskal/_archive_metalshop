
import {User, Profile} from "authoritarian/dist/interfaces.js"
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

import {
	Question,
	QuestionsModel,
} from "../interfaces.js"

export class QuestionsBoard extends
	mixinLoadable(
		mixinModelSubscription<QuestionsModel, typeof LitElement>(
			LitElement
		)
	)
{
	static get styles() { return [super.styles || css``, styles] }
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: Array}) questions: Question[] = []
	@property({type: String, reflect: true}) ["board-name"]: string

	loadingMessage = "loading questions board..."
	errorMessage = "questions board error"

	private async _downloadQuestions() {
		try {
			const {["board-name"]: boardName} = this
			this.loadableState = LoadableState.Loading
			if (!boardName)
				throw new Error(`questions-board requires attribute [board-name]`)
			this.questions = await this.model.bureau.fetchQuestions({boardName})
			this.loadableState = LoadableState.Ready
		}
		catch (error) {
			this.loadableState = LoadableState.Error
			console.error(error)
		}
	}

	firstUpdated() {
		this["initially-hidden"] = false
		this._downloadQuestions()
	}

	updated(changedProperties: PropertyValues) {
		if (changedProperties.has("board-name")) {
			this._downloadQuestions()
		}
	}

	renderReady() {
		const {questions} = this
		const {user, profile} = this.model.reader.state
		const {admin = false, premium = false} = (user && user.public.claims) || {}
		const isMine = (question: Question) => {
			return admin || (user && (user.userId === question.author.userId))
		}
		return html`
			${premium
				? renderQuestionDraft({user, profile})
				: null}
			<ol class="questions">
				${questions.sort(sortLikes).map(question => html`
					<li>
						${renderQuestion({question, mine: isMine(question)})}
					</li>
				`)}
			</ol>
		`
	}
}

const sortLikes = (a: Question, b: Question) => {
	return a.likes > b.likes ? -1: 1
}

function renderQuestionDraft({user, profile}: {user: User; profile: Profile}) {
	// return html`
	// 	<div class="question">
	// 		<div class="author">
	// 			<avatar-display .avatarState=${{
	// 				url: author.picture,
	// 				premium: author.premium
	// 			}}></avatar-display>
	// 			<div class="details">
	// 				<p class="nickname">${author.nickname}</p>
	// 				<p class="time" title=${`${datestring} ${timestring}`}>
	// 					${datestring}
	// 				</p>
	// 			</div>
	// 			<div class="likes">
	// 				<button
	// 				title="${liked ? "Unlike" : "Like"} question by ${author.nickname}">
	// 					${liked ? "♥" : "♡"}
	// 				</button>
	// 				<p>${likes}</p>
	// 			</div>
	// 		</div>

	// 		<div class="body">
	// 			<div class="content">${content}</div>
	// 		</div>

	// 		<div class="controls">
	// 			<div class="buttons">
	// 				${mine
	// 					? html`<button title="Delete question by ${author.nickname}">X</button>`
	// 					: null}
	// 			</div>
	// 		</div>
	// 	</div>
	// `
}

function renderQuestion({
	mine,
	question,
}: {mine: boolean; question: Question}) {
	const {
		questionId,
		time,
		likes,
		liked,
		author,
		content,
	} = question

	const date = new Date(time)
	const datestring = `${date.getFullYear()}-${date.getMonth() + 1}-`
		+ `${date.getDate()}`
	const timestring = date.toLocaleTimeString()

	return html`
		<div class="question" ?data-mine=${mine}>
			<div class="author">
				<avatar-display
					src=${author.picture}
					?premium=${author.premium}
				></avatar-display>
				<div class="card">
					<p class="nickname">${author.nickname}</p>
					<div class="details">
						<p class="time" title=${`${datestring} ${timestring}`}>
							${datestring}
						</p>
						<div class="likes">
							<button
								class="likebutton"
								title="${liked ? "Unlike" : "Like"} question by ${author.nickname}">
									<span class="like-heart">${liked ? "♥" : "♡"}</span>
									<span class="like-number">${likes}</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="body">
				<div class="content">${content}</div>
			</div>

			<div class="controls">
				<div class="buttons">
					${mine
						? html`
							<button title="Delete question by ${author.nickname}">
								X
							</button>`
						: null}
				</div>
			</div>
		</div>
	`
}

const styles = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
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

	.question > * {
		flex: 0 0 auto;
	}

	.author {
		font-size: 0.8em;
		display: flex;
		flex-direction: row;
		width: 32%;
		min-width: 15em;
		padding: 0.5em;
		text-align: center;
		background: rgba(255,255,255, 0.1);
	}

	.author .card {
		display: flex;
		flex-direction: column;
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
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.3em 1em;
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

	.content {
		width: 100%;
		font-size: 1em;
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
	}
`
