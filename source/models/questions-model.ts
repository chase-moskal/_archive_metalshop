
import {makeReader} from "../toolbox/make-reader.js"
import {
	QuestionDraft,
	QuestionsState,
	QuestionCommentDraft,
	QuestionsBureauTopic,
} from "../system/interfaces.js"

export function createQuestionsModel({questionsBureau}: {
	questionsBureau: QuestionsBureauTopic
}) {
	const state: QuestionsState = {
		admin: false,
		forums: {}
	}

	const {reader, publishStateUpdate} = makeReader(state)

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

	const actions: QuestionsBureauTopic = {
		async fetchQuestions({forumName}: {forumName: string}) {
			const questions = await questionsBureau.fetchQuestions({forumName})
			state.forums[forumName] = {questions}
			publishStateUpdate()
			return questions
		},

		async postQuestion(options: {forumName: string; question: QuestionDraft}) {
			const question = await questionsBureau.postQuestion(options)
			const forum = getOrCreateForum(options.forumName)
			forum.questions.push(question)
			publishStateUpdate()
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
			publishStateUpdate()
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
			publishStateUpdate()
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
			publishStateUpdate()
		}
	}

	return {
		reader,
		actions,
	}
}
