
import {
	User,
	Profile,
	QuestionsBureauTopic,
} from "authoritarian/dist/interfaces.js"

import {makeReader} from "../toolbox/pubsub.js"

import {
	UserState,
	GetAuthContext,
	QuestionsState,
	QuestionsModel,
	QuestionsBureauUi,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

export function createQuestionsModel({questionsBureau}: {
	questionsBureau: QuestionsBureauTopic
}): QuestionsModel {

	let getAuthContext: GetAuthContext

	const state: QuestionsState = {
		user: null,
		profile: null,
		questions: [],
	}

	const {reader, update} = makeReader(state)

	const fetchLocalQuestions = (board: string) => state.questions.filter(
		question => question.board === board
	)

	const getLocalQuestion = (questionId: string) => {
		return state.questions.find(
			question => question.questionId === questionId
		)
	}

	const addTokenToOptions = async<O extends {}>(options: O) => {
		const {accessToken} = await getAuthContext()
		return {...options, accessToken,}
	}

	const bureau: QuestionsBureauUi = {

		async fetchQuestions({board}) {
			const questions = await questionsBureau.fetchQuestions({board})
			for (const question of questions) {
				const existing = getLocalQuestion(question.questionId)
				if (existing) Object.assign(existing, question)
				else state.questions.push(question)
			}
			update()
			return questions
		},

		async postQuestion(options) {
			const question = await questionsBureau.postQuestion(
				await addTokenToOptions(options)
			)
			state.questions.push(question)
			update()
			return question
		},

		async deleteQuestion(options) {
			await questionsBureau.deleteQuestion(
				await addTokenToOptions(options)
			)
			state.questions = state.questions.filter(
				question => question.questionId !== options.questionId
			)
			update()
		},

		async likeQuestion(options) {
			const result = await questionsBureau.likeQuestion(
				await addTokenToOptions(options)
			)
			const likes = result.likeInfo.likes
			const question = getLocalQuestion(options.questionId)
			question.likeInfo.likes = likes
			question.likeInfo.liked = options.like
			update()
			return result
		}
	}

	const updateUser = (user: User) => {
		state.user = user
		if (user) {
			for (const question of state.questions) {
				if (question.author.user.userId === user.userId) {
					Object.assign(question.author.user, user)
				}
			}
		}
		update()
	}

	return {
		reader,
		bureau,
		fetchLocalQuestions,
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

			// update your own existing cached questions
			if (getAuthContext) {
				getAuthContext().then(({user}) => {
					for (const question of state.questions) {
						if (question.author.user.userId === user.userId) {
							question.author.profile = profile
						}
					}
					update()
				})
			}
		},
	}
}
