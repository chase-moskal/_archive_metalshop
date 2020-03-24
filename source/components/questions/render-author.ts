
import {html} from "lit-element"
import {heart} from "../../system/icons.js"
import {QuestionAuthor, LikeInfo} from "authoritarian/dist/interfaces.js"

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
	const datestring = `${date.getFullYear()}`
		+ `-${(date.getMonth() + 1).toString().padStart(2, "0")}`
		+ `-${date.getDate().toString().padStart(2, "0")}`
	const timestring = date.toLocaleTimeString()
	const {user, profile} = author
	return html`
		<div class="author">
			<metal-avatar
				src=${profile.avatar}
				?premium=${user.claims.premium}
			></metal-avatar>
			<div class="card">
				<p class="nickname">${profile.nickname}</p>
				<div class="details">
					<p class="time" title=${`${datestring} ${timestring}`}>
						${datestring}
					</p>
					${likeInfo ? html`
						<button
							class="likebutton"
							@click=${likeInfo.liked ? handleUnlikeClick : handleLikeClick}
							?data-liked=${likeInfo.liked}
							title="${likeInfo.liked ? "Unlike" : "Like"} question by ${profile.nickname}">
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
