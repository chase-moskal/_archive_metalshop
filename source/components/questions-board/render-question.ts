
import {html} from "lit-element"

import {
	Question,
	QuestionAuthor,
} from "../../interfaces.js"

import {renderAuthor} from "./render-author.js"
import {ascertainOwnership} from "./helpers.js"

export function renderQuestion({me, question}: {
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
