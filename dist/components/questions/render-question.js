import { html } from "lit-element";
import { renderAuthor } from "./render-author.js";
import { ascertainOwnership } from "./helpers.js";
export function renderQuestion({ me, question, prepareHandleLikeClick, prepareHandleDeleteClick, }) {
    const { time, author, content, likeInfo, questionId, } = question;
    const { authority, mine } = ascertainOwnership(question, me);
    const handleDeleteClick = prepareHandleDeleteClick(questionId);
    const handleLikeClick = prepareHandleLikeClick({ like: true, questionId });
    const handleUnlikeClick = prepareHandleLikeClick({ like: false, questionId });
    const renderDeleteButton = () => html `
		<button
			class="deletebutton"
			@click=${handleDeleteClick}
			title="Delete question by ${author.profile.nickname}">
				Delete
		</button>
	`;
    return html `
		<div
		 class="question"
		 ?data-mine=${mine}
		 data-question-id=${question.questionId}>
			${renderAuthor({
        time,
        author,
        likeInfo,
        handleLikeClick,
        handleUnlikeClick,
        placeholderNickname: "Unknown",
    })}

			<div class="body">
				<div class="content">${content}</div>
				<div class="controls">

					${mine ? renderDeleteButton() : authority ? html `
						<metal-is-admin>
							${renderDeleteButton()}
						</metal-is-admin>
					` : null}
				</div>
			</div>
		</div>
	`;
}
//# sourceMappingURL=render-question.js.map