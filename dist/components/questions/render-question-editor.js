import { html } from "lit-element";
import { renderAuthor } from "./render-author.js";
export function renderQuestionEditor({ expand, draftText, validation, handlePostClick, maxCharacterLimit, handleTextAreaChange, author = {
    profile: {
        avatar: null,
        userId: "FAKE_USER_ID",
        nickname: "FAKE_NICKNAME",
    },
    user: {
        userId: "FAKE_USER_UD",
        claims: {}
    },
}, }) {
    const { message, postable, angry } = validation;
    const invalid = !!message;
    return html `
		<div class="question editor">
			${renderAuthor({
        author,
        likeInfo: null,
        time: Date.now(),
        handleLikeClick: () => { },
        handleUnlikeClick: () => { },
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
        ? html `
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
	`;
}
//# sourceMappingURL=render-question-editor.js.map