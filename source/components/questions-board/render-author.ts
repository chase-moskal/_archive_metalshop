
import {html} from "lit-element"

import {
	LikeInfo,
	QuestionAuthor,
} from "../../interfaces.js"

import {heart} from "../../system/icons.js"

export function renderAuthor({
	time,
	author,
	likeInfo,
	handleLikeClick,
	handleUnlikeClick,
}: {
	time: number
	author: QuestionAuthor
	handleLikeClick: (event: MouseEvent) => void
	handleUnlikeClick: (event: MouseEvent) => void
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
						<button
							class="likebutton"
							@click=${likeInfo.liked ? handleUnlikeClick : handleLikeClick}
							?data-liked=${likeInfo.liked}
							title="${likeInfo.liked ? "Unlike" : "Like"} question by ${author.nickname}">
								<span class="like-heart">
									${heart}
								</span>
								<span class="like-number">
									${likeInfo.likes}
								</span>
						</button>
					` : null}
				</div>
			</div>
		</div>
	`
}
