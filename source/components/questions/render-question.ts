
import {html} from "lit-element"

import {Question, QuestionAuthor, PrepareHandleLikeClick}
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
					${authority
						? html`
							<button
								class="deletebutton"
								@click=${handleDeleteClick}
								title="Delete question by ${author.nickname}">
									Delete
							</button>`
						: null}
				</div>
			</div>
		</div>
	`
}
