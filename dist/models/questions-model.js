var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, action } from "mobx";
import * as loading from "../toolbox/loading.js";
export class QuestionsModel {
    constructor(options) {
        this.questions = [];
        this.fetchCachedQuestions = (board) => this.questions.filter(question => question.board === board);
        this.uiBureau = {
            fetchQuestions: async ({ board }) => {
                const questions = await this.#questionsBureau.fetchQuestions({ board });
                for (const question of questions)
                    this.cacheQuestion(question);
                return questions;
            },
            postQuestion: async (options) => {
                const question = await this.#questionsBureau.postQuestion(await this.addTokenToOptions(options));
                this.cacheQuestion(question);
                return question;
            },
            deleteQuestion: async (options) => {
                await this.#questionsBureau.deleteQuestion(await this.addTokenToOptions(options));
                this.deleteLocalQuestion(options.questionId);
            },
            likeQuestion: async (options) => {
                const result = await this.#questionsBureau.likeQuestion(await this.addTokenToOptions(options));
                const { liked, likes } = result.likeInfo;
                const { questionId } = options;
                this.likeLocalQuestion(questionId, liked, likes);
                return result;
            },
            purgeQuestions: async (options) => {
                const optionsWithToken = await this.addTokenToOptions(options);
                await this.#questionsBureau.purgeQuestions(optionsWithToken);
                this.deleteAllCachedQuestions();
            },
        };
        this.getLocalQuestion = (questionId) => questionId ? this.questions.find(question => question.questionId === questionId) : null;
        this.addTokenToOptions = async (options) => {
            const { accessToken } = await this.#getAuthContext();
            return { ...options, accessToken };
        };
        this.#questionsBureau = options.questionsBureau;
    }
    #getAuthContext;
    #questionsBureau;
    //.
    handleAuthLoad(authLoad) {
        this.#getAuthContext = loading.payload(authLoad)?.getAuthContext;
    }
    handleProfileUpdate(profile) {
        for (const question of this.questions) {
            if (question.author.profile.userId === profile?.userId) {
                question.author.profile = profile;
            }
        }
    }
    //.
    cacheQuestion(question) {
        const existing = this.getLocalQuestion(question.questionId);
        if (existing)
            Object.assign(existing, question);
        else
            this.questions.push(question);
    }
    deleteLocalQuestion(questionId) {
        this.questions = this.questions.filter(question => question.questionId !== questionId);
    }
    likeLocalQuestion(questionId, liked, likes) {
        const question = this.getLocalQuestion(questionId);
        question.likeInfo.liked = liked;
        question.likeInfo.likes = likes;
    }
    deleteAllCachedQuestions() {
        this.questions = [];
    }
}
__decorate([
    observable
], QuestionsModel.prototype, "questions", void 0);
__decorate([
    action.bound
], QuestionsModel.prototype, "handleAuthLoad", null);
__decorate([
    action.bound
], QuestionsModel.prototype, "handleProfileUpdate", null);
__decorate([
    action.bound
], QuestionsModel.prototype, "cacheQuestion", null);
__decorate([
    action.bound
], QuestionsModel.prototype, "deleteLocalQuestion", null);
__decorate([
    action.bound
], QuestionsModel.prototype, "likeLocalQuestion", null);
__decorate([
    action.bound
], QuestionsModel.prototype, "deleteAllCachedQuestions", null);
//# sourceMappingURL=questions-model.js.map