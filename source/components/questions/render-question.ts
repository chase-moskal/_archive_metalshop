
import {html} from "lit-element"
import {Question, QuestionAuthor} from "authoritarian/dist/interfaces.js"

import {PrepareHandleLikeClick}
	from "../../interfaces.js"

import {renderAuthor} from "./render-author.js"
import {ascertainOwnership} from "./helpers.js"

export function renderQuestion({
	me,
	question,
	prepareHandleLikeClick,
	prepareHandleDeleteClick,
}: {
	me: QuestionAuthor
	question: Question
	prepareHandleLikeClick: PrepareHandleLikeClick
	prepareHandleDeleteClick: (questionId: string) => (event: MouseEvent) => void
}) {
	const {
		questionId,
		time,
		author,
		content,
		likeInfo,
	} = question

	const {authority, mine} = ascertainOwnership(question, me)
	const handleDeleteClick = prepareHandleDeleteClick(questionId)
	const handleLikeClick = prepareHandleLikeClick({like: true, questionId})
	const handleUnlikeClick = prepareHandleLikeClick({like: false, questionId})

	const renderDeleteButton = () => html`
		<button
			class="deletebutton"
			@click=${handleDeleteClick}
			title="Delete question by ${author.profile.nickname}">
				Delete
		</button>
	`

	return html`
		<div class="question" ?data-mine=${mine}>
			${renderAuthor({
				time,
				author,
				likeInfo,
				handleLikeClick,
				handleUnlikeClick,
			})}

			<div class="body">
				<div class="content">${content}</div>
				<div class="controls">

					${mine ? renderDeleteButton() : authority ? html`
						<metal-admin-only>
							${renderDeleteButton()}
						</metal-admin-only>
					` : null}
				</div>
			</div>
		</div>
	`
}
