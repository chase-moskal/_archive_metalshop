import * as loading from "../toolbox/loading.js";
import { AuthPayload, QuestionsBureauUi } from "../interfaces.js";
import { Profile, Question, QuestionsBureauTopic } from "authoritarian/dist/interfaces.js";
export declare class QuestionsModel {
    #private;
    questions: Question[];
    constructor(options: {
        questionsBureau: QuestionsBureauTopic;
    });
    handleAuthLoad(authLoad: loading.Load<AuthPayload>): void;
    handleProfileUpdate(profile: Profile): void;
    fetchCachedQuestions: (board: string) => Question[];
    uiBureau: QuestionsBureauUi;
    private cacheQuestion;
    private deleteLocalQuestion;
    private likeLocalQuestion;
    private deleteAllCachedQuestions;
    private getLocalQuestion;
    private addTokenToOptions;
}
