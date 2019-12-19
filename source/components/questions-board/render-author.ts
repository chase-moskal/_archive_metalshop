
import {html} from "lit-element"

import {
	LikeInfo,
	QuestionAuthor,
} from "../../interfaces.js"

export function renderAuthor({author, time, likeInfo}: {
	time: number
	author: QuestionAuthor
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
						<div class="likes">
							<button
								class="likebutton"
								title="${likeInfo.liked ? "Unlike" : "Like"} question by ${author.nickname}">
									<span class="like-heart">
										${likeInfo.liked ? "♥" : "♡"}
									</span>
									<span class="like-number">
										${likeInfo.likes}
									</span>
							</button>
						</div>
					` : null}
				</div>
			</div>
		</div>
	`
}
