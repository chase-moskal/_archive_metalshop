
import {html} from "lit-element"
import {heart} from "../../system/icons.js"
import {LikeInfo, QuestionAuthor} from "../../interfaces.js"

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
	const datestring = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-`
		+ `${date.getDate().toString().padStart(2, "0")}`
	const timestring = date.toLocaleTimeString()

	return html`
		<div class="author">
			<metal-avatar
				src=${author.avatar}
				?premium=${author.premium}
			></metal-avatar>
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
