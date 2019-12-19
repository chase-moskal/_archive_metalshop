
import {LitElement, property, html, css, PropertyValues} from "lit-element"

import {mixinLoadable, LoadableState} from "../../framework/mixin-loadable.js"
import {
	mixinModelSubscription
} from "../../framework/mixin-model-subscription.js"

import {
	Question,
	QuestionAuthor,
	QuestionsModel,
} from "../../interfaces.js"

import {
	sortLikes,
	authorFromUserAndProfile,
} from "./helpers.js"
import {styles} from "./questions-board-styles.js"
import {renderQuestion} from "./render-question.js"
import {renderQuestionEditor} from "./render-question-editor.js"

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

	@property({type: String}) draftText: string = ""
	@property({type: Number}) minCharacterLimit: number = 10
	@property({type: Number}) maxCharacterLimit: number = 240

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

	private _handleTextAreaChange = (event: Event) => {
		const target = <HTMLTextAreaElement>event.target
		this.draftText = target.value
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
		const {
			questions,
			_handleTextAreaChange: handleTextAreaChange
		} = this
		const {user, profile} = this.model.reader.state
		const me = authorFromUserAndProfile({user, profile})
		const validation = this._validatePost(me)
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
