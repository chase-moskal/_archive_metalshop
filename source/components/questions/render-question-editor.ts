
import {html} from "lit-element"
import {renderAuthor} from "./render-author.js"
import {QuestionValidation} from "../../interfaces.js"
import {QuestionAuthor} from "authoritarian/dist/interfaces.js"

export function renderQuestionEditor({
	expand,
	draftText,
	validation,
	handlePostClick,
	maxCharacterLimit,
	handleTextAreaChange,
	author = {
		profile: {
			avatar: null,
			joined: Date.now() - (10 * (1000 * 60 * 60 * 24)),
			userId: "FAKE_USER_ID",
			nickname: "FAKE_NICKNAME",
		},
		user: {
			userId: "FAKE_USER_UD",
			claims: {}
		},
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
	const invalid = !!message
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
								?data-active=${invalid}>
									${message}
							</p>
						` : null}
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
