
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {mixinModelSubscription}
	from "../../framework/mixin-model-subscription.js"
import {mixinLoadable, LoadableState} from "../../framework/mixin-loadable.js"

import {
	QuestionDraft,
	QuestionAuthor,
	QuestionsModel,
	PrepareHandleLikeClick,
} from "../../interfaces.js"

import {styles} from "./metal-questions-styles.js"
import {renderQuestion} from "./render-question.js"
import {renderQuestionEditor} from "./render-question-editor.js"
import {sortQuestions, authorFromUserAndProfile} from "./helpers.js"

const Component = mixinLoadable(
	mixinModelSubscription<QuestionsModel, typeof LitElement>(
		LitElement
	)
)

export class MetalQuestions extends Component {
	static get styles() { return [super.styles || css``, styles] }
	@property({type: String, reflect: true}) ["board-name"]: string
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean

	@property({type: String}) draftText: string = ""
	@property({type: Number}) minCharacterLimit: number = 10
	@property({type: Number}) maxCharacterLimit: number = 240

	@property({type: Boolean}) adminMode: boolean = false

	loadingMessage = "loading questions board..."
	errorMessage = "questions board error"

	firstUpdated() {
		this["initially-hidden"] = false
		this._downloadQuestions()
	}

	updated(changedProperties: PropertyValues) {
		if (changedProperties.has("board-name")) {
			this._downloadQuestions()
		}
	}

	private async _downloadQuestions() {
		try {
			const {["board-name"]: boardName} = this
			this.loadableState = LoadableState.Loading
			if (!boardName)
				throw new Error(`questions-board requires attribute [board-name]`)
			await this.model.bureau.fetchQuestions({boardName})
			this.loadableState = LoadableState.Ready
		}
		catch (error) {
			this.loadableState = LoadableState.Error
			console.error(error)
		}
	}

	private _getQuestionDraft(): QuestionDraft {
		const {draftText: content} = this
		const {user, profile} = this.model.reader.state
		const author = authorFromUserAndProfile({user, profile})
		const time = Date.now()
		const valid = (author && content)
		return valid
			? {time, author, content}
			: null
	}

	private _handleTextAreaChange = (event: Event) => {
		const target = <HTMLTextAreaElement>event.target
		this.draftText = target.value
	}

	private _warnUnauthenticatedUser = (): boolean => {
		const {user} = this.model.reader.state
		let warned = false
		if (!user) {
			alert("you must be logged in to complete that action")
			warned = true
		}
		return warned
	}

	private _handlePostClick = async(event: MouseEvent) => {
		if (this._warnUnauthenticatedUser()) return
		const {["board-name"]: boardName} = this
		const {bureau} = this.model
		const question = this._getQuestionDraft()
		await bureau.postQuestion({boardName, question})
		this.draftText = ""
	}

	private _prepareHandleDeleteClick = (questionId: string) => async() => {
		if (this._warnUnauthenticatedUser()) return
		const {["board-name"]: boardName} = this
		const {bureau} = this.model
		await bureau.deleteQuestion({boardName, questionId})
	}

	private _prepareHandleLikeClick: PrepareHandleLikeClick = ({like, questionId}: {
		like: boolean
		questionId: string
	}) => async(event: MouseEvent) => {
		if (this._warnUnauthenticatedUser()) return
		const {["board-name"]: boardName} = this
		await this.model.bureau.likeQuestion({
			like,
			boardName,
			questionId,
		})
	}

	private _validatePost(author: QuestionAuthor) {
		const {
			draftText,
			minCharacterLimit: min,
			maxCharacterLimit: max
		} = this
		const {length} = draftText

		const tooLittle = length < min
		const tooBig = length > max

		const {premium} = author
		const {message, angry} = premium
			? length > 0
				? tooLittle
					? {message: "Not enough characters to post", angry: true}
					: tooBig
						? {message: "Too many characters to post", angry: true}
						: {message: "", angry: false}
				: {message: "Nothing to post", angry: false}
			: {message: "You must become premium to post", angry: false}

		const postable = !message
		return {postable, message, angry}
	}

	private _getBoard() {
		const {["board-name"]: boardName} = this
		const {boards} = this.model.reader.state
		const board = boards[boardName]
		if (!board) throw new Error(`questions board "${boardName}" not found`)
		return board
	}

	renderReady() {
		const {
			draftText,
			maxCharacterLimit,
			_handlePostClick: handlePostClick,
			_handleTextAreaChange: handleTextAreaChange,
			_prepareHandleLikeClick: prepareHandleLikeClick,
			_prepareHandleDeleteClick: prepareHandleDeleteClick,
		} = this

		const {questions} = this._getBoard()
		const {user, profile} = this.model.reader.state
		const me = authorFromUserAndProfile({user, profile})
		const validation = this._validatePost(me)
		const expand = draftText.length > 0

		return html`
			<div>
				<slot name="post">
					<h2>Post your own question</h2>
				</slot>
				${renderQuestionEditor({
					expand,
					draftText,
					author: me,
					validation,
					handlePostClick,
					maxCharacterLimit,
					handleTextAreaChange
				})}
			</div>
			<div>
				<slot name="rate">
					<h2>Rate questions</h2>
				</slot>
				<ol class="questions">
					${sortQuestions(me, questions).map(question => html`
						<li>
							${renderQuestion({
								me,
								question,
								prepareHandleLikeClick,
								prepareHandleDeleteClick,
							})}
						</li>
					`)}
				</ol>
			</div>
		`
	}
}
