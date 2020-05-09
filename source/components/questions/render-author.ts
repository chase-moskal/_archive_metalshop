
import {html} from "lit-element"
import {heart} from "../../system/icons.js"
import {QuestionAuthor, LikeInfo} from "authoritarian/dist/interfaces.js"

export function renderAuthor({
	time,
	author,
	likeInfo,
	handleLikeClick,
	handleUnlikeClick,
	placeholderNickname = "You"
}: {
	time: number
	author?: QuestionAuthor
	handleLikeClick: (event: MouseEvent) => void
	handleUnlikeClick: (event: MouseEvent) => void
	likeInfo?: LikeInfo
	placeholderNickname?: string
}) {
	const date = new Date(time)
	const datestring = `${date.getFullYear()}`
		+ `-${(date.getMonth() + 1).toString().padStart(2, "0")}`
		+ `-${date.getDate().toString().padStart(2, "0")}`
	const timestring = date.toLocaleTimeString()
	const premium = !!author?.user?.claims.premium
	const avatar = author?.profile?.avatar || null
	const nickname = author?.profile?.nickname || placeholderNickname
	return html`
		<div class="author">
			<metal-avatar .src=${avatar} ?premium=${premium}></metal-avatar>
			<div class="card">
				<p class="nickname">${nickname}</p>
				<div class="details">
					<p class="time" title=${`${datestring} ${timestring}`}>
						${datestring}
					</p>
					${likeInfo ? html`
						<button
							class="likebutton"
							@click=${likeInfo.liked ? handleUnlikeClick : handleLikeClick}
							?data-liked=${likeInfo.liked}
							title="${likeInfo.liked ? "Unlike" : "Like"} question by ${nickname}">
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
