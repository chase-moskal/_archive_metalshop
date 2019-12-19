
import {User, Profile} from "authoritarian/dist/interfaces.js"

import {
	Question,
	QuestionAuthor,
} from "../../interfaces.js"

export const sortLikes = (a: Question, b: Question) => {
	const aLikes = a.likeInfo ? a.likeInfo.likes : 0
	const bLikes = b.likeInfo ? b.likeInfo.likes : 0
	return aLikes > bLikes ? -1: 1
}

export const sortQuestions = (me: QuestionAuthor, questions: Question[]) =>
	[...questions]
		.sort(sortLikes)
		.sort(
			(a: Question, b: Question) =>
				(a.author.userId === me.userId) ? -1 : 1
		)

export function ascertainOwnership(question: Question, me: QuestionAuthor) {
	const admin = (me && me.admin) || false
	const mine = me && (me.userId === question.author.userId)
	return {
		mine,
		authority: admin || mine
	}
}

export const authorFromUserAndProfile = ({user, profile}: {
	user: User
	profile: Profile
}): QuestionAuthor => ({
	userId: user ? user.userId : null,
	admin: (user && user.public.claims.admin) || false,
	picture: profile ? profile.public.picture : "",
	nickname: profile? profile.public.nickname : "You",
	premium: user? user.public.claims.premium : false,
})
