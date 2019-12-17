
import {Profile, User} from "authoritarian/dist/interfaces.js"

import {makeReader} from "../toolbox/pubsub.js"

import {
	UserState,
	QuestionDraft,
	QuestionsState,
	QuestionsModel,
	QuestionCommentDraft,
	QuestionsBureauTopic,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

export function createQuestionsModel({questionsBureau}: {
	questionsBureau: QuestionsBureauTopic
}): QuestionsModel {

	const state: QuestionsState = {
		boards: {},
		user: null,
		profile: null,
	}

	const {reader, update} = makeReader(state)

	const getOrCreateForum = (boardName: string) => {
		const existing = state.boards[boardName]
		const board = existing || {questions: []}
		if (!existing) state.boards[boardName] = board
		return board
	}

	const getQuestion = (boardName: string, questionId: string) => {
		const board = getOrCreateForum(boardName)
		return board.questions.find(
			question => question.questionId === questionId
		)
	}

	const bureau: QuestionsBureauTopic = {
		async fetchQuestions({boardName}: {boardName: string}) {
			const questions = await questionsBureau.fetchQuestions({boardName})
			state.boards[boardName] = {questions}
			update()
			return questions
		},

		async postQuestion(options: {boardName: string; question: QuestionDraft}) {
			const question = await questionsBureau.postQuestion(options)
			const board = getOrCreateForum(options.boardName)
			board.questions.push(question)
			update()
			return question
		},

		async postComment(options: {
			boardName: string
			questionId: string
			comment: QuestionCommentDraft
		}) {
			const comment = await questionsBureau.postComment(options)
			const question = getQuestion(options.boardName, options.questionId)
			question.comments.push(comment)
			update()
			return comment
		},

		async deleteQuestion(options: {
			boardName: string
			questionId: string
		}) {
			await questionsBureau.deleteQuestion(options)
			const board = getOrCreateForum(options.boardName)
			board.questions = board.questions.filter(
				({questionId}) => questionId !== options.questionId
			)
			update()
		},

		async deleteComment(options: {
			boardName: string
			questionId: string
			commentId: string
		}) {
			await questionsBureau.deleteComment(options)
			const question = getQuestion(options.boardName, options.questionId)
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
			for (const [, board] of Object.entries(state.boards)) {
				for (const question of board.questions) {
					if (question.author.userId === user.userId) {
						question.author.premium = user.public.claims.premium
					}
				}
			}
		}
		update()
	}

	return {
		reader,
		bureau,
		async receiveUserUpdate({mode, getAuthContext}: UserState): Promise<void> {
			if (mode === UserMode.LoggedIn) {
				const {user} = await getAuthContext()
				updateUser(user)
			}
			else {
				updateUser(null)
			}
		},
		updateProfile(profile: Profile) {
			state.profile = profile
			update()
		},
	}
}
