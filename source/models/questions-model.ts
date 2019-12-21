
import {Profile, User} from "authoritarian/dist/interfaces.js"

import {makeReader} from "../toolbox/pubsub.js"

import {
	UserState,
	QuestionsState,
	QuestionsModel,
	GetAuthContext,
	QuestionsBureauTopic,
	QuestionsBureauUi,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

export function createQuestionsModel({questionsBureau}: {
	questionsBureau: QuestionsBureauTopic
}): QuestionsModel {

	let getAuthContext: GetAuthContext

	const state: QuestionsState = {
		boards: {},
		user: null,
		profile: null,
	}

	const {reader, update} = makeReader(state)

	const getOrCreateBoard = (boardName: string) => {
		const existing = state.boards[boardName]
		const board = existing || {questions: []}
		if (!existing) state.boards[boardName] = board
		return board
	}

	const getQuestion = (boardName: string, questionId: string) => {
		const board = getOrCreateBoard(boardName)
		return board.questions.find(
			question => question.questionId === questionId
		)
	}

	const addTokenToOptions = async<O extends {}>(options: O) => {
		const {accessToken} = await getAuthContext()
		return {...options, accessToken,}
	}

	const bureau: QuestionsBureauUi = {
		async fetchQuestions({boardName}) {
			const questions = await questionsBureau.fetchQuestions({boardName})
			state.boards[boardName] = {questions}
			update()
			return questions
		},

		async postQuestion(options) {
			const question = await questionsBureau.postQuestion(
				await addTokenToOptions(options)
			)
			const board = getOrCreateBoard(options.boardName)
			board.questions.push(question)
			update()
			return question
		},

		async deleteQuestion(options) {
			await questionsBureau.deleteQuestion(
				await addTokenToOptions(options)
			)
			const board = getOrCreateBoard(options.boardName)
			board.questions = board.questions.filter(
				({questionId}) => questionId !== options.questionId
			)
			update()
		},

		async likeQuestion(options) {
			const likes = await questionsBureau.likeQuestion(
				await addTokenToOptions(options)
			)
			const question = getQuestion(options.boardName, options.questionId)
			question.likeInfo.likes = likes
			question.likeInfo.liked = options.like
			update()
			return likes
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
		async receiveUserUpdate({mode, getAuthContext: getContext}: UserState): Promise<void> {
			getAuthContext = getContext
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
