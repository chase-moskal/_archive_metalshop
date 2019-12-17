
import {LitElement, property, html, css} from "lit-element"
import {User, Profile} from "authoritarian/dist/interfaces.js"

import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

import {
	Question,
	QuestionsModel,
	QuestionComment,
} from "../interfaces.js"

export class QuestionsForum extends
	mixinModelSubscription<QuestionsModel, typeof LitElement>(
		LitElement
	)
{
	static get styles() { return [super.styles || css``, styles] }
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: Array}) questions: Question[] = []
	@property({type: String, reflect: true}) ["forum-name"]: string

	async firstUpdated() {
		this["initially-hidden"] = false
		const {["forum-name"]: forumName} = this
		if (!forumName) throw new Error(`questions-forum requires attribute `
			+ `[forum-name]`)
		this.questions = await this.model.bureau.fetchQuestions({forumName})
	}

	render() {
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
		comments,
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
				<div class="details">
					<p class="nickname">${author.nickname}</p>
					<p class="time" title=${`${datestring} ${timestring}`}>
						${datestring}
					</p>
				</div>
				<div class="likes">
					<button
						title="${liked ? "Unlike" : "Like"} question by ${author.nickname}">
							${liked ? "♥" : "♡"}
					</button>
					<p>${likes}</p>
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

		<!-- <ol class="comments">
			${comments.map(comment => html`
				<li>${renderComment(comment)}</li>
			`)}
		</ol> -->
	`
}

function renderComment(comment: QuestionComment) {
	return html`
		<p>"${comment.content}" <em>— ${comment.author.nickname}</em></p>
	`
}

const styles = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
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
		background: var(--questions-forum-background, transparent);
		border: var(--questions-forum-border, 1px solid rgba(255,255,255, 0.2));
	}

	.question > * {
		flex: 0 0 auto;
		padding: 0.5rem;
	}

	.questions > li > .body {
		flex: 1 1 auto;
	}

	.author {
		width: 32%;
		text-align: center;
		background: rgba(255,255,255, 0.1);
	}

	.author .nickname {
		font-weight: bold;
	}

	.author .time {
		opacity: 0.6;
		font-size: 0.8em;
		margin-top: 0.2em;
	}

	.author .likes {
		margin-top: 0.5em;
	}

	.author .likes p {
		font-size: 0.8em;
	}

	button {
		opacity: 0.6;
		border: none;
		color: inherit;
		font-size: 1.5em;
		background: transparent;
		cursor: pointer;
	}

	button:hover {
		opacity: 1;
	}

	avatar-display {
		margin: auto;
	}

	.body {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.comments {
		list-style: none;
		font-size: 0.8em;
		padding: 0 1em;
	}

	.comments > li {
		padding: 0.2em;
		margin-top: 0.2em;
	}

	.comments > li > p > em {
		opacity: 0.6;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
	}

	.content {
		width: 100%;
		font-size: 1.3em;
	}

	@media (max-width: 500px) {
		.question {
			flex-direction: column;
		}
		.author {
			width: unset;
		}
		.controls {
			order: -1;
		}
	}
`
