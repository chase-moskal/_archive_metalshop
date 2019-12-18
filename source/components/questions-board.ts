
import {User, Profile} from "authoritarian/dist/interfaces.js"
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {mixinLoadable, LoadableState} from "../framework/mixin-loadable.js"
import {mixinModelSubscription} from "../framework/mixin-model-subscription.js"

import {
	LikeInfo,
	Question,
	QuestionsModel,
	QuestionAuthor,
} from "../interfaces.js"

import {styles} from "./styles/questions-board-styles.js"

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

	@property({type: Number}) minCharacterLimit: number = 10
	@property({type: Number}) maxCharacterLimit: number = 240
	@property({type: String}) draftText: string = ""

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

	private handleTextAreaChange = (event: Event) => {
		const target = <HTMLTextAreaElement>event.target
		this.draftText = target.value
	}

	get postable(): boolean {
		const {length} = this.draftText
		const {minCharacterLimit: min, maxCharacterLimit: max} = this
		return (length > min) && (length < max)
	}

	renderReady() {
		const {questions, handleTextAreaChange, postable} = this
		const {user, profile} = this.model.reader.state
		const {admin = false} = (user && user.public.claims) || {}
		const isMine = (question: Question) => {
			return admin || (user && (user.userId === question.author.userId))
		}
		const author = authorFromUserAndProfile({user, profile})
		return html`
			<div>
				<slot name="edit">
					<h2>Post your own question</h2>
				</slot>
				${renderQuestionEditor({
					author,
					postable,
					handleTextAreaChange
				})}
			</div>
			<div>
				<slot name="rate">
					<h2>Rate questions</h2>
				</slot>
				<ol class="questions">
					${questions.sort(sortLikes).map(question => html`
						<li>
							${renderQuestion({
								question,
								mine: isMine(question)
							})}
						</li>
					`)}
				</ol>
			</div>
		`
	}
}

const sortLikes = (a: Question, b: Question) => {
	const aLikes = a.likeInfo ? a.likeInfo.likes : 0
	const bLikes = b.likeInfo ? b.likeInfo.likes : 0
	return aLikes > bLikes ? -1: 1
}

function renderAuthor({author, time, likeInfo}: {
	time: number
	author: QuestionAuthor
	likeInfo?: LikeInfo
}) {
	const date = new Date(time)
	const datestring = `${date.getFullYear()}-${date.getMonth() + 1}-`
		+ `${date.getDate()}`
	const timestring = date.toLocaleTimeString()
	return html`
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
					${likeInfo ? html`
						<div class="likes">
							<button
								class="likebutton"
								title="${likeInfo.liked ? "Unlike" : "Like"} question by ${author.nickname}">
									<span class="like-heart">
										${likeInfo.liked ? "♥" : "♡"}
									</span>
									<span class="like-number">
										${likeInfo.likes}
									</span>
							</button>
						</div>
					` : null}
				</div>
			</div>
		</div>
	`
}

const authorFromUserAndProfile = ({user, profile}: {
	user: User
	profile: Profile
}): QuestionAuthor => ({
	userId: user ? user.userId : null,
	picture: profile ? profile.public.picture : "",
	nickname: profile? profile.public.nickname : "You",
	premium: user? user.public.claims.premium : false,
})

function renderQuestionEditor({
	postable,
	handleTextAreaChange,
	author = {
		userId: null,
		picture: "",
		nickname: "",
		premium: false,
	},
}: {
	postable: boolean
	handleTextAreaChange: (event: Event) => void
	author?: QuestionAuthor
}) {
	return html`
		<div class="question editor">
			${renderAuthor({
				author,
				likeInfo: null,
				time: Date.now(),
			})}

			<div class="body">
				<textarea
					@change=${handleTextAreaChange}
					@keyup=${handleTextAreaChange}
					class="content"
					placeholder="type your question here"
					></textarea>
				<div class="controls">
					<button
						?disabled=${!postable}
						class="postbutton"
						title="Post your question to the board">
							Post
					</button>
				</div>
			</div>
		</div>
	`
}

function renderQuestion({mine, question}: {
	mine: boolean
	question: Question
}) {
	const {
		questionId,
		time,
		author,
		content,
		likeInfo,
	} = question

	return html`
		<div class="question" ?data-mine=${mine}>
			${renderAuthor({author, time, likeInfo})}

			<div class="body">
				<div class="content">${content}</div>
				<div class="controls">
					${mine
						? html`
							<button
								class="deletebutton"
								title="Delete question by ${author.nickname}">
									Delete
							</button>`
						: null}
				</div>
			</div>
		</div>
	`
}
