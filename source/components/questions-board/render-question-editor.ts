
import {html} from "lit-element"

import {
	QuestionAuthor,
	QuestionValidation,
} from "../../interfaces.js"

import {renderAuthor} from "./render-author.js"

export function renderQuestionEditor({
	expand,
	draftText,
	validation,
	handlePostClick,
	maxCharacterLimit,
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
	draftText: string
	maxCharacterLimit: number
	validation: QuestionValidation
	handlePostClick: (event: MouseEvent) => void
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
				handleLikeClick: () => {},
				handleUnlikeClick: () => {},
			})}

			<div class="body">
				<textarea
					class="content"
					placeholder="type your question here"
					maxlength=${maxCharacterLimit}
					?data-expand=${expand}
					@change=${handleTextAreaChange}
					@keyup=${handleTextAreaChange}
					.value=${draftText}
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
						@click=${handlePostClick}
						class="postbutton"
						title="Post your question to the board">
							Post
					</button>
				</div>
			</div>
		</div>
	`
}
