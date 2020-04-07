
import {observable, action} from "mobx"
import {AuthMode, GetAuthContext, AuthUpdate, QuestionsBureauUi} from "../interfaces.js"
import {Profile, User, Question, QuestionsBureauTopic} from "authoritarian/dist/interfaces.js"

export class QuestionsModel {
	@observable user: User
	@observable questions: Question[] = []
	private getAuthContext: GetAuthContext
	private questionsBureau: QuestionsBureauTopic

	constructor(options: {
		questionsBureau: QuestionsBureauTopic
	}) { Object.assign(this, options) }

	@action.bound async handleAuthUpdate({mode, getAuthContext}: AuthUpdate) {
		this.getAuthContext = getAuthContext
		if (mode === AuthMode.LoggedIn) {
			const {user} = await this.getAuthContext()
			this.setUser(user)
		}
		else this.setUser(null)
	}

	@action.bound handleProfileUpdate(profile: Profile) {
		for (const question of this.questions) {
			if (question.author.profile.userId === profile?.userId) {
				question.author.profile = profile
			}
		}
	}

	fetchCachedQuestions = (board: string) => this.questions.filter(
		question => question.board === board
	)

	uiBureau: QuestionsBureauUi = {
		fetchQuestions: async({board}) => {
			const questions = await this.questionsBureau.fetchQuestions({board})
			for (const question of questions) this.cacheQuestion(question)
			return questions
		},
		postQuestion: async(options) => {
			const question = await this.questionsBureau.postQuestion(
				await this.addTokenToOptions(options)
			)
			this.cacheQuestion(question)
			return question
		},
		deleteQuestion: async(options) => {
			await this.questionsBureau.deleteQuestion(
				await this.addTokenToOptions(options)
			)
			this.deleteLocalQuestion(options.questionId)
		},
		likeQuestion: async(options) => {
			const result = await this.questionsBureau.likeQuestion(
				await this.addTokenToOptions(options)
			)
			const {liked, likes} = result.likeInfo
			const {questionId} = options
			this.likeLocalQuestion(questionId, liked, likes)
			return result
		},
		purgeQuestions: async(options: {board: string}) => {
			const optionsWithToken = await this.addTokenToOptions(options)
			await this.questionsBureau.purgeQuestions(optionsWithToken)
			this.deleteAllCachedQuestions()
		},
	}

	@action.bound private setUser(user: User) {
		this.user = user
		if (user) {
			for (const question of this.questions) {
				if (question.author.user.userId === user.userId) {
					Object.assign(question.author.user, user)
				}
			}
		}
	}

	@action.bound private cacheQuestion(question: Question) {
		const existing = this.getLocalQuestion(question.questionId)
		if (existing) Object.assign(existing, question)
		else this.questions.push(question)
	}

	@action.bound private deleteLocalQuestion(questionId: string) {
		this.questions = this.questions.filter(
			question => question.questionId !== questionId
		)
	}

	@action.bound private likeLocalQuestion(
		questionId: string,
		liked: boolean,
		likes: number,
	) {
		const question = this.getLocalQuestion(questionId)
		question.likeInfo.liked = liked
		question.likeInfo.likes = likes
	}

	@action.bound private deleteAllCachedQuestions() {
		this.questions = []
	}

	private getLocalQuestion = (questionId: string) => this.questions.find(
		question => question.questionId === questionId
	)

	private addTokenToOptions = async<O extends {}>(options: O) => {
		const {accessToken} = await this.getAuthContext()
		return {...options, accessToken}
	}
}
