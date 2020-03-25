
import {Question, QuestionAuthor} from "authoritarian/dist/interfaces.js"

export const sortLikes = (a: Question, b: Question) => {
	const aLikes = a.likeInfo ? a.likeInfo.likes : 0
	const bLikes = b.likeInfo ? b.likeInfo.likes : 0
	return aLikes > bLikes ? -1: 1
}

export const sortQuestions = (me: QuestionAuthor, questions: Question[]) => {

	const myQuestions = questions.filter(
		question => question.author.user.userId === me.user.userId
	).sort(sortLikes)

	const theirQuestions = questions.filter(
		question => question.author.user.userId !== me.user.userId
	).sort(sortLikes)

	return [...myQuestions, ...theirQuestions]
}

export function ascertainOwnership(question: Question, me: QuestionAuthor) {
	const admin = (me && me.user.claims.admin)
	const mine = me && (me.user.userId === question.author.user.userId)
	return {
		mine,
		authority: admin || mine
	}
}
