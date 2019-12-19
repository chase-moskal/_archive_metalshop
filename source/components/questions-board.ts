
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

export interface QuestionValidation {
	angry: boolean
	message: string
	postable: boolean
}

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

	private validatePost(author: QuestionAuthor) {
		const {
			draftText,
			minCharacterLimit: min,
			maxCharacterLimit: max
		} = this
		const {length} = draftText

		const tooLittle = length < min
		const tooBig = length > max

		const {message, angry} = author.userId
			? length > 0
				? tooLittle
					? {message: "Not enough characters to post", angry: true}
					: tooBig
						? {message: "Too many characters to post", angry: true}
						: {message: "", angry: false}
				: {message: "Nothing to post", angry: false}
			: {message: "You must be logged in to post", angry: false}

		const postable = !message
		return {postable, message, angry}
	}

	renderReady() {
		const {questions, handleTextAreaChange} = this
		const {user, profile} = this.model.reader.state
		const me = authorFromUserAndProfile({user, profile})
		const validation = this.validatePost(me)
		const expand = this.draftText.length > 0

		return html`
			<div>
				<slot name="post">
					<h2>Post your own question</h2>
				</slot>
				${renderQuestionEditor({
					expand,
					author: me,
					validation,
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
							${renderQuestion({me, question})}
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

function ascertainOwnership(question: Question, me: QuestionAuthor) {
	const admin = (me && me.admin) || false
	const mine = me && (me.userId === question.author.userId)
	return {
		mine,
		authority: admin || mine
	}
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
	admin: (user && user.public.claims.admin) || false,
	picture: profile ? profile.public.picture : "",
	nickname: profile? profile.public.nickname : "You",
	premium: user? user.public.claims.premium : false,
})

function renderQuestionEditor({
	expand,
	validation,
	handleTextAreaChange,
	author = {
		userId: null,
		admin: false,
		picture: "",
		nickname: "",
		premium: false,
	},
}: {
	expand: boolean
	validation: QuestionValidation
	handleTextAreaChange: (event: Event) => void
	author?: QuestionAuthor
}) {
	const {message, postable, angry} = validation
	const messageActive = !!message
	return html`
		<div class="question editor">
			${renderAuthor({
				author,
				likeInfo: null,
				time: Date.now(),
			})}

			<div class="body">
				<textarea
					class="content"
					placeholder="type your question here"
					?data-expand=${expand}
					@change=${handleTextAreaChange}
					@keyup=${handleTextAreaChange}
				></textarea>
				<div class="controls">
					${message
						? html`
							<p
								class="message"
								?data-angry=${angry}
								?data-active=${messageActive}>
									${message}
							</p>
						`
						: null}
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

function renderQuestion({me, question}: {
	me: QuestionAuthor
	question: Question
}) {
	const {
		questionId,
		time,
		author,
		content,
		likeInfo,
	} = question

	const {authority, mine} = ascertainOwnership(question, me)

	return html`
		<div class="question" ?data-mine=${mine}>
			${renderAuthor({author, time, likeInfo})}

			<div class="body">
				<div class="content">${content}</div>
				<div class="controls">
					${authority
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
