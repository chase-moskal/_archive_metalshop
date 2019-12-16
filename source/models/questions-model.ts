
import {Profile, User} from "authoritarian/dist/interfaces.js"
import {makeReader} from "../toolbox/pubsub.js"
import {
	LoginDetail,
	QuestionDraft,
	QuestionsState,
	QuestionsModel,
	QuestionCommentDraft,
	QuestionsBureauTopic,
	UserState,
} from "../interfaces.js"
import { UserMode } from "./user-model.js"

export function createQuestionsModel({questionsBureau}: {
	questionsBureau: QuestionsBureauTopic
}): QuestionsModel {
	const state: QuestionsState = {
		forums: {},
		user: null,
		profile: null,
	}

	const {reader, update} = makeReader(state)

	const getOrCreateForum = (forumName: string) => {
		const existing = state.forums[forumName]
		const forum = existing || {questions: []}
		if (!existing) state.forums[forumName] = forum
		return forum
	}

	const getQuestion = (forumName: string, questionId: string) => {
		const forum = getOrCreateForum(forumName)
		return forum.questions.find(
			question => question.questionId === questionId
		)
	}

	const bureau: QuestionsBureauTopic = {
		async fetchQuestions({forumName}: {forumName: string}) {
			const questions = await questionsBureau.fetchQuestions({forumName})
			state.forums[forumName] = {questions}
			update()
			return questions
		},

		async postQuestion(options: {forumName: string; question: QuestionDraft}) {
			const question = await questionsBureau.postQuestion(options)
			const forum = getOrCreateForum(options.forumName)
			forum.questions.push(question)
			update()
			return question
		},

		async postComment(options: {
			forumName: string
			questionId: string
			comment: QuestionCommentDraft
		}) {
			const comment = await questionsBureau.postComment(options)
			const question = getQuestion(options.forumName, options.questionId)
			question.comments.push(comment)
			update()
			return comment
		},

		async deleteQuestion(options: {
			forumName: string
			questionId: string
		}) {
			await questionsBureau.deleteQuestion(options)
			const forum = getOrCreateForum(options.forumName)
			forum.questions = forum.questions.filter(
				({questionId}) => questionId !== options.questionId
			)
			update()
		},

		async deleteComment(options: {
			forumName: string
			questionId: string
			commentId: string
		}) {
			await questionsBureau.deleteComment(options)
			const question = getQuestion(options.forumName, options.questionId)
			question.comments = question.comments.filter(
				({commentId}) => commentId !== options.commentId
			)
			update()
		},

		async likeQuestion(o) {
			return null
		}
	}

	const updateUser = (user: User) => {
		state.user = user
		if (user) {
			for (const [, forum] of Object.entries(state.forums)) {
				for (const question of forum.questions) {
					if (question.author.userId === user.userId) {
						question.author.premium = user.public.claims.premium
					}
				}
			}
		}
	}

	return {
		reader,
		bureau,
		async receiveUserUpdate({mode, getAuthContext}: UserState): Promise<void> {
			if (mode === UserMode.LoggedIn) {
				const {user} = await getAuthContext()
				updateUser(user)
				update()
			}
			else {
				updateUser(null)
				update()
			}
		},
		updateProfile(profile: Profile) {
			state.profile = profile
			update()
		},
	}
}
